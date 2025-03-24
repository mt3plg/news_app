import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function SearchScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://67cadc4e3395520e6af36705.mockapi.io/posts');
                setPosts(response.data);
                setFilteredPosts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Could not load posts');
                setLoading(false);
                console.error('Error loading posts:', err);
            }
        };

        fetchPosts();
    }, []);


    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredPosts(filtered);
        }
    }, [searchQuery, posts]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e33d51" />
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
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#e33d51" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>


            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search posts..."
                    placeholderTextColor="#ccc"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>


            {filteredPosts.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No results found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.postItem}
                            onPress={() => navigation.navigate('PostView', { post: item })}
                        >
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.postImage}
                            />
                            <View style={styles.postContent}>
                                <Text style={styles.postTitle}>{item.title}</Text>
                                <Text style={styles.postDate}>{item.createdAt}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
            <BottomNav navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c2b5c',
        padding: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        margin: 20,
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
    searchContainer: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#fff',
        fontFamily: 'TS-regular',
        fontSize: 16,
    },
    postItem: {
        margin: 20,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    postImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    postContent: {
        flex: 1,
        justifyContent: 'center',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'TS-regular',
        marginBottom: 5,
    },
    postDate: {
        fontSize: 12,
        color: '#e33d51',
        fontFamily: 'TS-regular',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'TS-regular',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0c2b5c',
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
        fontFamily: 'TS-regular',
    },
    flatListContent: {
        paddingBottom: 100,
    },
});