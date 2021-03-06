import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button } from 'react-native';
import customStyles from 'src/utils/styles';
import { getHotGalleriesFromApi } from '../../api/IMGURApi';
import GalleryItem from '../Search/GalleryItem';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {galleries: [], isLoading: true, refreshing: false};
    this._isMounted = false;
    this.page = 0;
    this.flatList = null;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.navigation.setParams({
      tapOnTabNavigator: this.tapOnTabNavigator,
    });
  }

  tapOnTabNavigator = () => {
    this.flatList.scrollToOffset({ animated: true, offset: 0 });
  }

  _loadGalleries() {
    getHotGalleriesFromApi(this.page++, this.props.profile).then((data) => {
      if (this._isMounted) {
        this.setState({isLoading: false});
        if (data.success)
          this.setState({galleries: data.data});
      }
    });
  }

  onRefresh () {
    this.page = 0;
    this._loadGalleries();
  }

  render() {
    if (!this._isMounted) {
      this._loadGalleries();
    }
    if (this.state.isLoading) {
      return (
        <View style={customStyles.principalContainer}>
          <ActivityIndicator size={58} color={'green'} />
        </View>
      );
    } else {
      if (this.state.galleries.length === 0) {
        return (
          <View style={customStyles.principalContainer}>
            <View style={customStyles.errorView}>
              <Text>No data found press here to refresh</Text>
              <Button title="Refresh" onPress={() => this.onRefresh()} />
            </View>
          </View>
        )
      } else
        return (
          <View style={customStyles.container}>
            <FlatList
              ref={(ref) => {this.flatList = ref;}}
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              data={this.state.galleries}
              renderItem={({ item }) => <GalleryItem gallery={item} />}
            />
          </View>
        )
      }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps)(Home);
