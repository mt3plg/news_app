import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from 'react-native-reanimated';
import { useNavigationState } from '@react-navigation/native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

const PRIMARY_COLOR = '#180f3b';
const SECONDARY_COLOR = '#fff';

export default function BottomNav({ navigation }) {
    const state = useNavigationState(state => state);
    const currentRoute = state.routes[state.index].name;

    const getSelectedIcon = () => {
        switch (currentRoute) {
            case 'Main':
                return 'home';
            case 'Search':
                return 'search';
            case 'SavedPosts':
                return 'mark';
            case 'PostView':
                return null;
            default:
                return null;
        }
    };

    const selectedIcon = getSelectedIcon();

    const handlePress = (iconName) => {
        if (iconName === 'search') {
            navigation.navigate('Search');
        } else if (iconName === 'home') {
            navigation.navigate('Main');
        } else if (iconName === 'mark') {
            navigation.navigate('SavedPosts');
        }
    };

    const iconLabels = {
        drawer: 'Menu',
        home: 'News',
        search: 'Search',
        mark: 'Mark',
    };

    return (
        <View style={styles.bottomNav}>
            <AnimatedTouchableOpacity
                layout={LinearTransition.springify().mass(0.5)}
                style={[
                    styles.iconContainer,
                    selectedIcon === 'home' && styles.selectedIconContainer,
                ]}
                onPress={() => handlePress('home')}
            >
                <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={24}
                    color={selectedIcon === 'home' ? PRIMARY_COLOR : SECONDARY_COLOR}
                />
                {selectedIcon === 'home' && (
                    <AnimatedText
                        key={selectedIcon}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.iconText}
                    >
                        {iconLabels.home}
                    </AnimatedText>
                )}
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity
                layout={LinearTransition.springify().mass(0.5)}
                style={[
                    styles.iconContainer,
                    selectedIcon === 'search' && styles.selectedIconContainer,
                ]}
                onPress={() => handlePress('search')}
            >
                <Octicons
                    name="search"
                    size={24}
                    color={selectedIcon === 'search' ? PRIMARY_COLOR : SECONDARY_COLOR}
                />
                {selectedIcon === 'search' && (
                    <AnimatedText
                        key={selectedIcon}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.iconText}
                    >
                        {iconLabels.search}
                    </AnimatedText>
                )}
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity
                layout={LinearTransition.springify().mass(0.5)}
                style={[
                    styles.iconContainer,
                    selectedIcon === 'mark' && styles.selectedIconContainer,
                ]}
                onPress={() => handlePress('mark')}
            >
                <FontAwesome6
                    name="bookmark"
                    size={24}
                    color={selectedIcon === 'mark' ? PRIMARY_COLOR : SECONDARY_COLOR}
                />
                {selectedIcon === 'mark' && (
                    <AnimatedText
                        key={selectedIcon}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.iconText}
                    >
                        {iconLabels.mark}
                    </AnimatedText>
                )}
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity
                layout={LinearTransition.springify().mass(0.5)}
                style={[
                    styles.iconContainer,
                    selectedIcon === 'drawer' && styles.selectedIconContainer,
                ]}
                onPress={() => handlePress('drawer')}
            >
                <FontAwesome6
                    name="bars-staggered"
                    size={24}
                    color={selectedIcon === 'drawer' ? PRIMARY_COLOR : SECONDARY_COLOR}
                />
                {selectedIcon === 'drawer' && (
                    <AnimatedText
                        key={selectedIcon}
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={styles.iconText}
                    >
                        {iconLabels.drawer}
                    </AnimatedText>
                )}
            </AnimatedTouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        width: '80%',
        alignSelf: 'center',
        bottom: 40,
        borderRadius: 40,
        paddingHorizontal: 12,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        opacity: 0.94,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        paddingHorizontal: 13,
        borderRadius: 30,
    },
    selectedIconContainer: {
        backgroundColor: SECONDARY_COLOR,
    },
    iconText: {
        color: PRIMARY_COLOR,
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 14,
    },
});