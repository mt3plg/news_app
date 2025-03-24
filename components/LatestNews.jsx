import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Image, Text, View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LatestNews() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const heightAnim = useRef(new Animated.Value(100)).current;

    const bottomAnim = useRef(new Animated.Value(100)).current;

    const expand = () => {
        setIsExpanded(true);
        Animated.parallel([
            Animated.timing(heightAnim, {
                toValue: SCREEN_HEIGHT - 50,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(bottomAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const collapse = () => {
        setIsExpanded(false);
        Animated.parallel([
            Animated.timing(heightAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(bottomAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://67cadc4e3395520e6af36705.mockapi.io/posts');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Could not load news');
                setLoading(false);
                console.error('Error loading news:', err);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
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

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: heightAnim,
                    bottom: bottomAnim,
                },
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Latest News</Text>
                {isExpanded ? (
                    <TouchableOpacity onPress={collapse}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={expand}>
                        <Text style={styles.seeMore}>See More</Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.newsItem}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.newsImage}
                        />
                        <Text style={styles.newsTitle}>{item.title}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={isExpanded}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,


    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'TS-regular',
    },
    seeMore: {
        fontSize: 16,
        color: '#e33d51',
        fontFamily: 'TS-regular',
    },
    closeButton: {
        fontSize: 16,
        color: '#e33d51',
        fontFamily: 'TS-regular',
    },
    newsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 10,
        borderRadius: 10,
    },
    newsImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    newsTitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontFamily: 'TS-regular',
    },
    loadingContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0c2b5c',
    },
    loadingText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'TS-regular',
    },
    errorContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0c2b5c',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        fontFamily: 'TS-regular',
    },
});