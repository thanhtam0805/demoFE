import React, { useEffect, useState } from "react";
import * as UserService from "../../services/UserService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Empty, Popconfirm } from "antd";
import { HeartFilled } from "@ant-design/icons";
import * as message from "../../component/Message/Message";
import { WrapperContainer, WrapperListOrder, WrapperItemOrder, WrapperHeaderItem } from "../MyOrder/style"; 

const FavoritePage = () => {
  const user = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id && user?.access_token) {
        const res = await UserService.getFavorites(user.id, user.access_token);
        setFavorites(res?.data || []);
      }
    };
    fetchFavorites();
  }, [user?.id, user?.access_token]);

  const handleRemoveFavorite = async (productId) => {
    const res = await UserService.removeFavorite(user.id, productId, user.access_token);
    if (res.status === "OK") {
      setFavorites((prev) => prev.filter((item) => item._id !== productId));
      message.success("Đã bỏ khỏi yêu thích!");
    } else {
      message.error(res.message || "Có lỗi khi xóa khỏi yêu thích!");
    }
  };

  return (
    <WrapperContainer>
      <div style={{ margin: '0 auto', width: '950px', minHeight: 500 }}>
        <h2 style={{ margin: "16px 0 24px 0" }}>Danh sách sản phẩm yêu thích</h2>
        <WrapperListOrder>
          {favorites.length === 0 ? (
            <Empty description="Chưa có sản phẩm yêu thích" />
          ) : (
            favorites.map((item) => (
              <WrapperItemOrder key={item._id} style={{ marginBottom: 18 }}>
                <WrapperHeaderItem>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: 'cover',
                      border: '1px solid #f5f5f5',
                      padding: 4,
                      borderRadius: 6,
                      marginRight: 10,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/product-detail/${item._id}`)}
                  />
                  <div
                    style={{
                      flex: 1,
                      fontSize: '15px',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/product-detail/${item._id}`)}
                  >
                    {item.name}
                  </div>
                  <span style={{ fontSize: '15px', color: '#e30019', marginLeft: 'auto', fontWeight: 700 }}>
                    {(item.price || 0).toLocaleString()}₫
                  </span>
                  <Popconfirm
                    title="Bỏ sản phẩm này khỏi yêu thích?"
                    onConfirm={() => handleRemoveFavorite(item._id)}
                    okText="Đồng ý"
                    cancelText="Huỷ"
                  >
                    <HeartFilled
                      style={{
                        color: "red",
                        fontSize: 22,
                        marginLeft: 20,
                        cursor: "pointer"
                      }}
                      title="Bỏ khỏi yêu thích"
                    />
                  </Popconfirm>
                </WrapperHeaderItem>
              </WrapperItemOrder>
            ))
          )}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default FavoritePage;
