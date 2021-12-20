import { StyleSheet } from 'react-native'

import {GREEN, OCEAN_BLUE, WHITE} from '../Colors'

const styles: any = StyleSheet.create({
    container: {
        flex: 1
    },
    logo: {
        top: '15%',
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 200
    },
    formContainer : {
        marginLeft: 25,
        marginRight: 25
    },
    inputLabel: {
        fontSize: 12,
        color: WHITE,
        height: 20,
    },
    inputContainer: {
        height: 60,
        borderBottomWidth: 2,
        borderBottomColor: WHITE,
        marginBottom: 20
    },
    input: {
        color: WHITE,
        flexDirection: 'row',
        paddingLeft: 40
    },
    inputPlaceHolder: {
        color: WHITE
    },
    inputIcon: {
        width: 20,
        height: 20
    },
    inputPassIcon: {
        width: 15,
        height: 20
    },
    buttonLogin: {
        backgroundColor: GREEN,
        borderRadius: 50,
        paddingVertical: 8.5,
        height: 40,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonLoginLabel: {
        color: WHITE,
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    credentialsActivity: {
        position: 'absolute',
        top: 8,
        right: 10,
    },
    errorMessage: {
        backgroundColor: '#b41c1a',
        color: WHITE,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        borderRadius: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        height: 30,
        textAlign: 'center'
    },
    modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        height: 280,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    modalIcon: {
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 18,
        textTransform: 'capitalize',
        fontWeight: '500',
        marginBottom: 15
    },
    modalDescription: {
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 16,
        textAlign: 'center'
    },
    text: {
        color: 'white',
        fontSize: 14,
        paddingHorizontal: 2,
        margin: 0
    },
    textRight: {
        textAlign: 'right'
    },
    settingsIcon: {
        width: 20,
        height: 20,
        marginHorizontal: 10
    }
});

export default styles;
