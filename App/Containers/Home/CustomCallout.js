import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';
import { getHeightPercent } from '../../Services/RadioService';

const propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

class CustomCallout extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.bubble}>
          <View style={styles.amount}>{this.props.children}</View>
        </View>
      </View>
    );
  }
}

CustomCallout.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    width: getHeightPercent(30.0),
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#F8E71C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  amount: {
    flex: 1,
  },
});

export default CustomCallout;