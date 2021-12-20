import React, {PureComponent} from 'react'
import {View, Text, StyleSheet, Image,} from 'react-native'
import {Row} from '../components/Grid'

import {BLACK, BROWN_GREY, BROWN_LIGHT_GREY} from '../styles/Colors'
import lockIcon from '../../assets/images/icons/lock_icon.png'

class OportunidadCardLock extends PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerDetails}>
                    <Row style={{paddingRight: 5}}>
                        <Image style={styles.imagePrivado} source={lockIcon}/>
                    </Row>
                    <Row style={{paddingRight: 5}}>
                        <Text style={styles.negocio}>Sin acceso al detalle.</Text>
                    </Row>
                </View>
            </View>
        )
    }
}

export default OportunidadCardLock

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: 'auto',
        backgroundColor: BROWN_LIGHT_GREY,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4,
        marginBottom: 15,
        marginRight: 5,
    },
    containerDetails: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    negocio: {
        fontSize: 16,
        color: BLACK,
        fontWeight: '600',
        marginRight: 10
    },
    imagePrivado: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

})