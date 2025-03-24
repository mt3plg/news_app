import { StyleSheet } from 'react-native';

export const gStyle = StyleSheet.create({
    main: {
        flex: 1,
        padding: 20,

    },
    title: {
        paddingTop: 40,
        fontSize: 20,
        color: '#fff',
        fontFamily: 'TS-regular',
    },
    topicsTitle: {
        top: -40,
        fontSize: 14,
        color: '#fff',
        fontFamily: 'TS-regular',
    }

});

export const bottomNav = StyleSheet.create({
    bottomNav: {
        width: '90%',
        marginBottom: 20,
        left: '5%',
        height: 70,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        position: 'absolute',
        bottom: 0,
        borderRadius: 50,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 10,
        margin: 20,
    },
    selectedIconContainer: {
        backgroundColor: '#e33d51',
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
});

export const header = StyleSheet.create({
    header: {
        width: '100%',
        height: 100,
        top: -50,
        backgroundColor: '#0c2b5c',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    logo: {
        top: 20,
        width: 120,
        height: 190,
    },
});