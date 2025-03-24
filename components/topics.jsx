import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolateColor,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Topics({ onTopicChange }) {
    const topics = ['ALL', 'POLITICS', 'SPORTS', 'MUSIC', 'GAMES'];

    const animatedValues = topics.reduce((acc, topic) => {
        acc[topic] = useSharedValue(0);
        return acc;
    }, {});

    const [selectedTopic, setSelectedTopic] = useState('ALL');

    const handlePress = (topic) => {
        setSelectedTopic(topic);
        onTopicChange(topic);
        animatedValues[topic].value = withTiming(1, { duration: 300 });
        topics.forEach((t) => {
            if (t !== topic) {
                animatedValues[t].value = withTiming(0, { duration: 300 });
            }
        });
    };

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
                contentContainerStyle={styles.carouselContent}
            >
                {topics.map((topic) => {
                    const animatedStyle = useAnimatedStyle(() => {
                        return {
                            backgroundColor: interpolateColor(
                                animatedValues[topic].value,
                                [0, 1],
                                ['#0c2b5c', '#e33d51']
                            ),
                        };
                    });

                    return (
                        <AnimatedTouchableOpacity
                            layout={LinearTransition.springify().mass(0.5)}
                            key={topic}
                            style={styles.topicContainer}
                            onPress={() => handlePress(topic)}
                        >
                            <Animated.View style={[styles.background, animatedStyle]}>
                                <AnimatedText
                                    entering={FadeIn.duration(200)}
                                    exiting={FadeOut.duration(200)}
                                    style={[
                                        styles.topicText,
                                        selectedTopic === topic && styles.selectedTopicText,
                                    ]}
                                >
                                    {topic}
                                </AnimatedText>
                            </Animated.View>
                        </AnimatedTouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        top: -50,
        marginHorizontal: 20,
    },
    carousel: {
        marginVertical: 10,
    },
    carouselContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    topicContainer: {
        marginHorizontal: 5,
        borderRadius: 20,
        overflow: 'hidden',
    },
    background: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        opacity: 0.8,
    },
    topicText: {
        fontSize: 16,
        color: '#ccc',
        fontFamily: 'TS-regular',
    },
    selectedTopicText: {
        color: '#fff',
    },
});