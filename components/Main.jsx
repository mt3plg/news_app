import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { gStyle } from '../styles/style';


export default function Main() {

    return (
        <View style={gStyle.main}>
            <Text style={gStyle.title} >Головна сторінка</Text>
        </View>
    );

}

const styles = StyleSheet.create({

});
