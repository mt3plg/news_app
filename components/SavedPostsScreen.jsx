import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav';

const { width } = Dimensions.get('screen');

const SPACING = 10;
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.6;
const VISIBLE_ITEMS = 3;

const PostItem = React.memo(({ item, index: itemIndex, scrollXAnimated, fadeAnim, slideAnim, textFadeAnim, textScaleAnim, onPress }) => {
    const inputRange = [itemIndex - 1, itemIndex, itemIndex + 1];
    const translateX = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [100, 0, -100],
        extrapolate: 'clamp',
    });
    const scale = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
        extrapolate: 'clamp',
    });
    const opacity = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
    });
    const rotate = scrollXAnimated.interpolate({
        inputRange,
        outputRange: ['10deg', '0deg', '-10deg'],
        extrapolate: 'clamp',
    });
    const translateY = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [20, 0, 20],
        extrapolate: 'clamp',
    });

    return (
        <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
            <Animated.View
                style={{
                    position: 'absolute',
                    left: -ITEM_WIDTH / 2,
                    opacity: Animated.multiply(fadeAnim, opacity),
                    transform: [
                        { translateX },
                        { scale },
                        { rotate },
                        { translateY: Animated.add(slideAnim, translateY) },
                    ],
                    height: ITEM_HEIGHT,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 12,
                }}
            >
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                        width: ITEM_WIDTH,
                        height: ITEM_HEIGHT,
                        borderRadius: 20,
                    }}
                />
                <Animated.View
                    style={{
                        ...styles.textContainer,
                        opacity: textFadeAnim,
                        transform: [{ scale: textScaleAnim }],
                    }}
                >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.date}>{item.createdAt}</Text>
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
});

export default function SavedPostsScreen({ navigation: propNavigation }) {
    const navigation = useNavigation();
    const [savedPosts, setSavedPosts] = useState([]);
    const scrollXAnimated = useRef(new Animated.Value(0)).current;
    const [index, setIndex] = useState(0);
    const isAnimating = useRef(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const textFadeAnim = useRef(new Animated.Value(0)).current;
    const textScaleAnim = useRef(new Animated.Value(0.8)).current;

    const loadSavedPosts = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem('savedPosts');
            const posts = saved ? JSON.parse(saved) : [];
            setSavedPosts(posts);

            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            textFadeAnim.setValue(0);
            textScaleAnim.setValue(0.8);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(200),
                    Animated.spring(textFadeAnim, {
                        toValue: 1,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.spring(textScaleAnim, {
                        toValue: 1,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        } catch (error) {
            console.error('Error loading saved posts:', error);
        }
    }, [fadeAnim, slideAnim, textFadeAnim, textScaleAnim]);

    useEffect(() => {
        loadSavedPosts();
    }, [loadSavedPosts]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadSavedPosts);
        return unsubscribe;
    }, [navigation, loadSavedPosts]);

    useEffect(() => {
        if (savedPosts.length === 0) return;
        scrollXAnimated.stopAnimation();
        isAnimating.current = true;
        Animated.spring(scrollXAnimated, {
            toValue: index,
            useNativeDriver: true,
            stiffness: 80,
            damping: 15,
        }).start(() => {
            isAnimating.current = false;
        });
    }, [index, scrollXAnimated, savedPosts.length]);

    const updateIndex = useCallback((newIndex) => {
        setIndex(newIndex);
    }, []);

    const panGesture = useMemo(() => {
        return Gesture.Pan()
            .minDistance(50)
            .onEnd((event) => {
                if (isAnimating.current) return;
                if (typeof event.velocityX !== 'number') return;
                if (event.velocityX < 0 && index < savedPosts.length - 1) {
                    runOnJS(updateIndex)(index + 1);
                } else if (event.velocityX > 0 && index > 0) {
                    runOnJS(updateIndex)(index - 1);
                }
            });
    }, [index, savedPosts.length, updateIndex]);

    const handlePress = useCallback((post) => {
        navigation.navigate('PostView', { post });
    }, [navigation]);

    const cellRendererComponent = useCallback(
        ({ children, style, index, ...props }) => {
            const newStyle = [style, { zIndex: savedPosts.length - index }];
            return (
                <View style={newStyle} index={index} {...props}>
                    {children}
                </View>
            );
        },
        [savedPosts.length]
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#e33d51" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Saved Posts</Text>

            {savedPosts.length === 0 ? (
                <View style={styles.noPostsContainer}>
                    <Text style={styles.noPostsText}>No saved posts yet.</Text>
                </View>
            ) : (
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <View style={styles.sliderContainer}>
                        <GestureDetector gesture={panGesture}>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={savedPosts}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    contentContainerStyle={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        padding: SPACING * 2,
                                    }}
                                    scrollEnabled={false}
                                    removeClippedSubviews={true}
                                    initialNumToRender={3}
                                    CellRendererComponent={cellRendererComponent}
                                    renderItem={({ item, index: itemIndex }) => (
                                        <PostItem
                                            item={item}
                                            index={itemIndex}
                                            scrollXAnimated={scrollXAnimated}
                                            fadeAnim={fadeAnim}
                                            slideAnim={slideAnim}
                                            textFadeAnim={textFadeAnim}
                                            textScaleAnim={textScaleAnim}
                                            onPress={handlePress}
                                        />
                                    )}
                                />
                            </View>
                        </GestureDetector>
                    </View>
                </GestureHandlerRootView>
            )}
            <BottomNav navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c2b5c',
    },
    backButton: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    backText: {
        color: '#e33d51',
        fontSize: 16,
        fontFamily: 'TS-regular',
        marginLeft: 8,
    },
    header: {
        margin: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'TS-regular',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    sliderContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
        fontFamily: 'TS-regular',
        flexShrink: 1,
    },
    date: {
        fontSize: 12,
        color: '#e33d51',
        fontFamily: 'TS-regular',
    },
    textContainer: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    noPostsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPostsText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'TS-regular',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
});