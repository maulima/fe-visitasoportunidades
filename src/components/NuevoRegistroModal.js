import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'
import {connect} from 'react-redux'
import {BACKGROUND_COLOR_TRANS, GREEN, WHITE} from '../styles/Colors'
import NavBar from './NavBar'
import CloseModalButton from './CloseModalButton'

type Props = {}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        tipoVisitaR:state.visitas.tipoVisitaR,
    }
}


class NuevoRegistroModal extends Component<Props> {

    handleNavigation = (screen) => {
        const {navigation,tipoVisitaR} = this.props
        navigation.navigate(screen,{tipoVisita:tipoVisitaR})
    }

    render() {
        const {navigation} = this.props

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <NavBar headerLeft={<CloseModalButton onPress={() => {
                        navigation.goBack()
                    }}/>}/>
                    <ScrollView/>
                    <View style={styles.buttonsContainer}>
                        <Text style={styles.textCreate}>Crear Nueva:</Text>
                        <TouchableOpacity onPress={() => {
                            this.handleNavigation('FormularioVisita')
                        }} style={styles.button}
                        {...testID({
                            id: `BotonMenuNuevo`,
                            label: `Botón de acceso a la creación de una nueva visita`
                          })
                         }>
                            <Text style={styles.textButton}>Visita</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.handleNavigation('FormularioOportunidad')
                        }} style={styles.button} 
                        {...testID({
                            id: `BotonMenuNuevo`,
                            label: `Botón de acceso a la creación de una nueva oportunidad`
                          })
                         }>
                            <Text style={styles.textButton}>Oportunidad</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(mapStateToProps,null)(NuevoRegistroModal)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10
    },
    buttonsContainer: {
        flexDirection: 'column',
    },
    button: {
        backgroundColor: GREEN,
        borderRadius: 50,
        paddingVertical: 8.5,
        height: 40,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50
    },
    textButton: {
        textAlign: 'center',
        color: WHITE,
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 18,
    },
    textCreate: {
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 15
    }
})
