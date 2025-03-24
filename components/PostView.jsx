import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from './BottomNav';

export default function PostView({ route, navigation }) {
    const { post } = route.params;

    const [isSaved, setIsSaved] = useState(false);


    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
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
        ]).start();
    }, [fadeAnim, slideAnim]);


    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const saved = await AsyncStorage.getItem('savedPosts');
                const savedPosts = saved ? JSON.parse(saved) : [];
                const isPostSaved = savedPosts.some((p) => p.id === post.id);
                setIsSaved(isPostSaved);
            } catch (error) {
                console.error('Помилка при перевірці збережених постів:', error);
            }
        };
        checkIfSaved();
    }, [post.id]);


    const toggleSave = async () => {
        try {
            const saved = await AsyncStorage.getItem('savedPosts');
            let savedPosts = saved ? JSON.parse(saved) : [];

            if (isSaved) {

                savedPosts = savedPosts.filter((p) => p.id !== post.id);
            } else {

                savedPosts.push(post);
            }

            await AsyncStorage.setItem('savedPosts', JSON.stringify(savedPosts));
            setIsSaved((prev) => !prev);
        } catch (error) {
            console.error('Помилка при збереженні поста:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#e33d51" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={toggleSave}
                    >
                        <FontAwesome6
                            name="bookmark"
                            size={24}
                            color={isSaved ? '#e33d51' : '#fff'}
                            solid={isSaved}
                        />
                    </TouchableOpacity>
                </View>


                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: post.imageUrl }}
                            style={styles.postImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                            style={styles.gradientOverlay}
                        />
                    </View>
                </Animated.View>


                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.title}>{post.title}</Text>
                </Animated.View>


                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.date}>{post.createdAt}</Text>
                </Animated.View>


                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <View style={styles.descriptionContainer}>
                        <Ionicons name="document-text-outline" size={20} color="#e33d51" style={styles.descriptionIcon} />
                        <Text style={styles.description}>{post.description}</Text>
                    </View>
                </Animated.View>
            </ScrollView>
            <BottomNav navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c2b5c',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
    saveButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 20,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'TS-regular',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    date: {
        fontSize: 14,
        color: '#e33d51',
        fontFamily: 'TS-regular',
        marginBottom: 20,
        opacity: 0.9,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    descriptionIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    description: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontFamily: 'TS-regular',
        lineHeight: 24,
        opacity: 0.95,
    },
});