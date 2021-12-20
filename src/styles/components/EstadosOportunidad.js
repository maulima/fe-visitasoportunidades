import { StyleSheet } from 'react-native'

import { WHITE, OCEAN_BLUE } from '../Colors'

const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: OCEAN_BLUE,
        borderRadius: 100,
        overflow: 'hidden'
    },
    rightTabContainer: {
        borderLeftWidth: 1,
        borderColor: OCEAN_BLUE
    },
    leftTabContainer: {
        borderRightWidth: 1,
        borderColor: OCEAN_BLUE
    },
    tabText: {
        width: '100%',
        textAlign: 'center',
        color: OCEAN_BLUE,
        fontSize: 16,
        paddingVertical: 12.5
    },
    tabTextActive: {
        backgroundColor: OCEAN_BLUE,
        color: WHITE
    },
    disabled: {
        opacity: 0.4
    }
})

export default styles
