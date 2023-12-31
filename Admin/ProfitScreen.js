import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Component chính cho màn hình thống kê lợi nhuận
const ProfitScreen = () => {
  const [data,setData]=useState([]);
  const [total, setTotal] = useState(0);
    useEffect(() => {
        const countProducts = async () => {
            const productData = {};
          
            // Truy vấn số lượng sản phẩm đã mua
            const buySnapshot = await firestore().collection('Buy').get();
            buySnapshot.forEach((doc) => {
              const data = doc.data();
              const productId = data.id_product;
          
              // Tăng số lượng sản phẩm đã mua
              if (productData[productId]) {
                productData[productId].buyCount += data.quantity;
              } else {
                productData[productId] = { buyCount: data.quantity, rentCount: 0 };
              }
            });
          
            // Truy vấn số lượng sản phẩm đã thuê
            const rentSnapshot = await firestore().collection('Rent').get();
            rentSnapshot.forEach((doc) => {
              const data = doc.data();
              const productId = data.id_product;
          
              // Tăng số lượng sản phẩm đã thuê
              if (productData[productId]) {
                productData[productId].rentCount += data.quantity;
              } else {
                productData[productId] = { buyCount: 0, rentCount: data.quantity };
              }
            });
          
            // Lấy thông tin sản phẩm từ collection 'product'
            const productSnapshot = await firestore().collection('Product').get();
            productSnapshot.forEach((doc) => {
              const productId = doc.id;
          
              // Nếu sản phẩm có trong ít nhất một trong hai collection 'buy' hoặc 'rent'
              if (productData[productId]) {
                const productInfo = doc.data();
                productData[productId] = { ...productData[productId], ...productInfo };
              }
            });
            let totalProfit = 0;

            Object.values(productData).forEach((item) => {
              totalProfit += item.buyCount * item.price + item.rentCount * item.rent;
            });
      
            setTotal(totalProfit);
      
            return productData;
          };
          
          // Sử dụng hàm để lấy dữ liệu
          countProducts()
            .then((result) => {
              setData(result);
            })
            .catch((error) => {
              console.error('Error counting products:', error);
            });
      }, []);

  const renderProfitItem =({item})=>{
      return(
          <View style={styles.profitItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Số sản phẩm bán: {item.buyCount}</Text>
            <Text>Số lần đượcc thuê: {item.rentCount}</Text>
            <Text>Profit: {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.buyCount*item.price+item.rentCount*item.rent)}</Text>
          </View>
      )
  };
  return (
    <View style={{flex:1}}>      
      <FlatList
        data={Object.values(data)}
        renderItem={renderProfitItem}
      />
      <View style={{height:100}}>
            </View>
       <View style={{position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',alignItems: 'center', justifyContent: 'space-between',flex:1}}>
                <Text style={{fontSize:22,fontWeight:'bold',flex:2}}>Tổng thu: </Text>
                <Text style={{fontSize:22,fontWeight:'bold',flex:6,color:"red"}}>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profitItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ProfitScreen;
