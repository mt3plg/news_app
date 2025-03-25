import axios from 'axios';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
    StatusBar,
    Image,
    FlatList,
    Dimensions,
    Animated,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get('screen');

const SPACING = 10;
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.6;
const VISIBLE_ITEMS = 3;

const PostItem = React.memo(({ item, index: itemIndex, scrollXAnimated, onPress }) => {
    const inputRange = [itemIndex - 1, itemIndex, itemIndex + 1];

    const translateX = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [20, 0, -200],
        extrapolate: 'clamp',
    });
    const scale = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.8, 0.9, 1.3],
        extrapolate: 'clamp',
    });
    const opacity = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
        extrapolate: 'clamp',
    });

    return (
        <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
            <Animated.View
                style={{
                    position: 'absolute',
                    left: -ITEM_WIDTH / 2,
                    opacity,
                    transform: [{ translateX }, { scale }],
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
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.date}>{item.createdAt}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
});

export default function News({ navigation, selectedTopic }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollXAnimated = useRef(new Animated.Value(0)).current;
    const [index, setIndex] = useState(0);
    const isAnimating = useRef(false);


    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://67cadc4e3395520e6af36705.mockapi.io/posts');
            setData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Could not load posts');
            setLoading(false);
            console.error('Error loading posts:', err);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const filteredData = useMemo(() => {
        if (selectedTopic === 'ALL') {
            return data;
        }
        return data.filter(
            (post) => post.type && post.type.toUpperCase() === selectedTopic
        );
    }, [selectedTopic, data]);

    useEffect(() => {
        setIndex(0);
    }, [filteredData]);

    useEffect(() => {
        scrollXAnimated.stopAnimation();
        isAnimating.current = true;
        Animated.spring(scrollXAnimated, {
            toValue: index,
            useNativeDriver: true,
            stiffness: 350,
            damping: 160,
        }).start(() => {
            isAnimating.current = false;
        });
    }, [index, scrollXAnimated]);

    const updateIndex = useCallback((newIndex) => {
        setIndex(newIndex);
    }, []);

    const panGesture = useMemo(() => {
        return Gesture.Pan()
            .minDistance(50)
            .onEnd((event) => {
                if (isAnimating.current) return;
                if (typeof event.velocityX !== 'number') return;
                if (event.velocityX < 0 && index < filteredData.length - 1) {
                    runOnJS(updateIndex)(index + 1);
                } else if (event.velocityX > 0 && index > 0) {
                    runOnJS(updateIndex)(index - 1);
                }
            });
    }, [index, filteredData.length, updateIndex]);

    const handlePress = useCallback((post) => {
        navigation.navigate('PostView', { post });
    }, [navigation]);

    const cellRendererComponent = useCallback(
        ({ children, style, index, ...props }) => {
            const newStyle = [style, { zIndex: filteredData.length - index }];
            return (
                <View style={newStyle} index={index} {...props}>
                    {children}
                </View>
            );
        },
        [filteredData.length]
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (filteredData.length === 0 && !loading) {
        return (
            <View style={styles.noPostsContainer}>
                <Text style={styles.noPostsText}>No posts available for this topic.</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar />
                <GestureDetector gesture={panGesture}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={filteredData}
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
                            getItemLayout={(data, index) => ({
                                length: ITEM_WIDTH,
                                offset: (ITEM_WIDTH + SPACING * 2) * index,
                                index,
                            })}
                            CellRendererComponent={cellRendererComponent}
                            renderItem={({ item, index: itemIndex }) => (
                                <PostItem
                                    item={item}
                                    index={itemIndex}
                                    scrollXAnimated={scrollXAnimated}
                                    onPress={handlePress}
                                />
                            )}
                        />
                    </View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        bottom: 70,
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
        color: 'white',
        fontFamily: 'TS-regular',
    },
    textContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
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
    },
});