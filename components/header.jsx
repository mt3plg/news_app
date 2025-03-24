import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { header } from '../styles/style';
import logo from '../assets/logo.png';


export default function Header() {
    return (
        <View style={header.header}>
            <Image
                source={logo}
                style={header.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({

});