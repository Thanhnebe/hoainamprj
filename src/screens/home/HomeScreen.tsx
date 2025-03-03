import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';
import { appColors } from '../../constants/appColors';
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const auth = useSelector(authSelector);
  const [products, setProducts] = useState([]);
  const carouselRef = useRef(null);

  const imageData = [
    { id: 1, url: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 2, url: 'https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045.jpg' },
    { id: 3, url: 'https://tipyjakfotit.cz/wp-content/uploads/2017/02/shutterstock_1200858942.jpg' },
  ];

  useEffect(() => {
    // Fake API call to get top 10 best-selling products
    setTimeout(() => {
      setProducts(
        Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Sản phẩm ${i + 1}` }))
      );
    }, 1000);
  }, []);

  // Render từng item trong slide show
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  return (
    <View style={{ marginTop: 75}}>
      <StatusBar barStyle="dark-content" />

      {/* Thanh tìm kiếm + Avatar User */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={appColors.black} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          style={{
            flex: 1,
            marginHorizontal: 10,
            borderWidth: 1,
            borderColor: appColors.gray,
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        />
        <TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color={appColors.black} />
        </TouchableOpacity>
        <Image
          source={{ uri: auth?.photoUrl || 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' }}
          style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }}
        />
      </View>

      <ScrollView>
        {/* Slide Show */}
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={imageData}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 40}
            loop
            autoplay
            autoplayInterval={3000}
          />
        </View>

        {/* Danh sách category */}
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: appColors.gray }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Danh sách category</Text>
        </View>

        {/* 10 sản phẩm bán chạy */}
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: appColors.gray }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>10 sản phẩm bán chạy</Text>
          <FlatList
            horizontal
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 10, backgroundColor: appColors.lightGray, margin: 5, borderRadius: 5 }}>
                <Text>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* Lazy loading sản phẩm */}
        <View style={{ padding: 10, backgroundColor: appColors.green, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            Sử dụng lazy loading để hiển thị tất cả sản phẩm
          </Text>
        </View>
      </ScrollView>

      {/* Thanh Navigation */}
      <View style={{ height: 50, backgroundColor: appColors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Navigation</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});

export default HomeScreen;
