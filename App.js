import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';


import Header from './components/header';
import BottomNav from './components/BottomNav';
import Topics from './components/topics';
import News from './components/News';
import LatestNews from './components/LatestNews';
import PostView from './components/PostView';
import SearchScreen from './components/SearchScreen';
import SavedPostsScreen from './components/SavedPostsScreen';

const fonts = () => Font.loadAsync({
  'TS-regular': require('./assets/fonts/TenorSans-Regular.ttf'),
});


function MainScreen({ navigation }) {
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Topics onTopicChange={setSelectedTopic} />
        <News navigation={navigation} selectedTopic={selectedTopic} />

      </View>
      <LatestNews />
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [font, setFont] = useState(false);

  if (font) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostView"
            component={PostView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SavedPosts"
            component={SavedPostsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading
        startAsync={fonts}
        onFinish={() => setFont(true)}
        onError={(error) => console.log(error)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c2b5c',
  },
  content: {
    flex: 1,
    flexDirection: 'column', // вертикальне розміщення
  },
});