import React, { PureComponent } from 'react'
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

import { BACKGROUND_COLOR, GREEN, WHITE } from '../styles/Colors'
import { FiltroOportunidad, ListaEstadosOportunidad } from '../constants/Data'
import RadioButton from "./RadioButton";
import NavBar from './NavBar'

type Props = {
    list: Array<Object>,
    title?: String,
    headerLeft?: React.Element<*>,
    type?: String,
    saveSelection: func,
    defaultValue?: any
}

class ItemListModal extends PureComponent<Props> {

    state = {
        list: this.props.list,
        selectItem: null
    }

    componentWillMount() {
        const {defaultValue} = this.props

        this.setState({selectItem: defaultValue || null})
    }

    componentDidMount() {
        const { type } = this.props

        this.getFilterList(type)
    }

    componentWillReceiveProps(nextProps) {
        const { type, list } = this.props

        if (type !== nextProps.type) {
            this.getFilterList(nextProps.type)
        }

        if (Object.keys(list || {}).length !== Object.keys(nextProps.list || {}).length) {
            this.setState({
                list: nextProps.list
            })
        }

    }

    getFilterList = (type) => {
        let list

        switch (type) {
            case FiltroOportunidad.STATUS_OPORTUNIDAD:
                list = ListaEstadosOportunidad
            default:
                list = this.state.list
                break
        }

        this.setState({
            list: list
        })
    }

    handleSelectItem = (value) => {
        this.setState({
            selectItem: value
        })
    }

    renderList = () => {
        const { pID } = this.props
        const { list, selectItem } = this.state
        let index = 1

        if (list.length === 0 || list.length === 1) {
            return null
        }

        return Object.keys(list || {}).map((item, key) => {
            const rID = `${pID}R${index}`
            index += 1

            return <RadioButton key={ key } label={ list[item].name } value={ item } active={ selectItem } handleSelectItem={ this.handleSelectItem } rID={ rID } />
        })
    }

    render() {
        const { pID } = this.props
        const { selectItem } = this.state

        return (
            <View style={ styles.container }>
                <NavBar title={ this.props.title } headerLeft={ this.props.headerLeft } headerInput={ false } />
                <ScrollView style={ styles.formContainer }>
                    { this.renderList() }
                </ScrollView>
                <TouchableOpacity onPress={ () => { if (!_.isEmpty(selectItem)) FiltroOportunidad.TIPO_NEGOCIOS === this.props.type ? this.props.saveSelection(selectItem) : this.props.saveSelection(selectItem, this.props.title) } } style={ styles.button }
                                  {...testID({
                                      id: `${pID}Button`,
                                      label: `Contenedor de botón de ${pID}`
                                  })}
                >
                    <Text style={ styles.buttonText }
                          {...testID({
                              id: `${pID}TextBox`,
                              label: `Contenedor de texto de ${pID}`
                          })}
                    >
                        Seleccionar
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    const type = ownProps.type

    return {
        type
    }
}

export default connect(mapStateToProps)(ItemListModal)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 20,
    },
    formContainer: {
        //paddingTop: 2,
    },
    button: {
        backgroundColor: GREEN,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        alignItems: 'center'
    },
    buttonText: {
        color: WHITE,
        textAlign: 'center',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
})
