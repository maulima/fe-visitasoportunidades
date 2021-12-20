import React, {PureComponent} from 'react'
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

type Props = {
    onPress: func
}

class FilterButton extends PureComponent<Props> {

    render() {
        let filtersActive = false
        const {currentScreen} = this.props
        if (currentScreen === 'VisitasRealizadasScreen') {
            filtersActive = this.props.filtroVisitas.filtersActive
        } else if (currentScreen === 'OportunidadesScreen') {
            filtersActive = this.props.filtroOportunidades.filtersActive
        }else if(currentScreen === 'VisitasPriorizadasScreen'){
            filtersActive = this.props.filtroVisitas.filtersActive
        }
        const imageFilter = filtersActive ?
            <Image style={styles.container} source={require('./../../assets/images/icons/filter_header_active.png')}/> :
            <Image style={styles.container} source={require('./../../assets/images/icons/filter_header.png')}/>

        return (
            <View>
                <TouchableOpacity onPress={this.props.onPress}
                                  {...testID({
                                      id: `AbrirModalFilterButton`,
                                      label: `Boton que abre el modal de filtros`
                                  })
                                  }
                >
                    {imageFilter}
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        filtroVisitas: state.filtroVisitas,
        filtroOportunidades: state.filtroOportunidades,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton)

const styles = StyleSheet.create({
    container: {
        marginRight: 15
    }
})