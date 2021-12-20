import React, { PureComponent } from 'react'
import { View, Text, Platform, StyleSheet,SafeAreaView } from 'react-native'
import { Col, Row } from './Grid'

type Props = {
    title?: String,
    headerInput?: React.Element<*>,
    headerLeft?: React.Element<*>,
    headerRight?: React.Element<*>,
}

class NavBar extends PureComponent<Props> {

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.left}>
                    { this.props.headerLeft }
                </View>

                <Col size={10} />

                <Col size={80}>
                    { this.props.headerInput ?
                        this.props.headerInput
                    :
                        <View style={ styles.itemContainer }><Text style={styles.title}>{this.props.title}</Text></View>
                    }
                </Col>

                <Col size={10} />

                <View style={styles.right}>
                    {this.props.headerRight }
                </View>
            </SafeAreaView>
        )

    }
}

export default NavBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: Platform.OS === 'ios' ? 25 : 0,
        paddingHorizontal: 17,
        justifyContent: 'center',
    },
    left: {
        flex: 1,
        top: 0,
        position: 'absolute',
        left: 0,
        //zIndex: 10
    },
    right: {
        position: 'absolute',
        right: 0,
        zIndex: 10
    },
    itemContainer: {
        flexDirection:'row',
        alignItems: 'center',
        paddingRight: 15
    },
    title: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
        width: '100%',
        flexWrap: 'wrap'
    },
})
