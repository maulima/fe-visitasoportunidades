import React, { PureComponent } from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Col, Row } from './Grid'
import testID from '../../custom_node_modules/react-native-testid'
import { OCEAN_BLUE, WHITE } from '../styles/Colors'

type Props = {
    icon:? any,
    title: String,
    otherStyle: Object,
    otherTextStyle: Object
}
class SectionCard extends PureComponent<Props> {

    render() {
        const { toRight, title,oportunidadVencidad } = this.props
        return (
            <Row>
                <Col size={95} offset={toRight ? 5 : 0} style={ styles.container }>
                    <View style={styles.imageContainer}>
                        <Image accessible={ true } style={styles.image} source={ this.props.icon }/>
                        { oportunidadVencidad === true ? <Image accessible={ true } style={styles.imageicon2} />:null}
                    </View>
                    <Text {...testID({
                              id: title,
                              label: `Contenedor de texto del botón`
                          })}

                          style={styles.text}>{ title }</Text>
                </Col>
            </Row>
        )
    }
}

export default SectionCard

const styles = StyleSheet.create({
    container: {
        height: 140,
        marginBottom: 20,
        paddingTop: 20,
        backgroundColor: WHITE,
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderRadius:5
    },
    imageContainer: {
        width: 60,
        height: 60,
        padding: 10,
        display: 'flex',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop:-8,
        marginBottom: 10
    },
    image: {
    },
    imageicon2:{
      position:'absolute',
      left:75
    },
    text: {
        width: '100%',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#1E1E1E',
        fontWeight: '600',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10
    }
})
