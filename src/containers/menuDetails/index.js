import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  message,
  Row,
  Table,
  Image,
  List,
  Divider,
  Col,
} from "antd";
import { URL, MENU } from "../../utils/constants";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;
const MenuDetail = (props) => {
  const menuId = props?.match?.params?.menuId;
  const [data, setData] = useState([]);
  const [imageURL, setImageURL] = useState();
  const [restDetail, setRestDetail] = useState();
  useEffect(() => {
    fetch(`${URL}${MENU}?id=${menuId}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("json----", json);
        setData(json?.items);
        setImageURL(
          Object.values(json?.menus)?.length > 0 &&
            Object.values(json?.menus)[0]?.menu_img
        );
        setRestDetail(
          Object.values(json?.restaurants)?.length > 0 &&
            Object.values(json?.restaurants)[0]
        );
      });
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <Row>
            <Col span={24}>
              <Text style={{ fontSize: 18 }}>
                <b>{text}</b>
              </Text>
            </Col>
            <Col span={24}>{/* <Text>{record?.lower_name}</Text> */}</Col>
          </Row>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  return (
    <Row
      style={{
        width: "100%",
        height: "100%",
        marginTop: "5%",
      }}
      justify="center"
      align="middle"
      className="justify-content-center"
    >
      <Row
        style={{
          width: "80%",
          height: "100%",
          alignSelf: "center",
        }}
      >
        <Row
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "",
          }}
        >
          <Col>
            <Title level={2}>Restaurant Name : {restDetail?.name}</Title>
            <Title level={4}>{restDetail?.lower_name}</Title>
            <Title level={4}>Address : {restDetail?.address}</Title>
          </Col>
          <Col>
            <Button type="primary">
              <Link key="list-loadmore-edit" to={`/search`}>
                Search
              </Link>
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Image width={400} src={imageURL} />
          </Col>
          <Col span={12}>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Col>
        </Row>
      </Row>
    </Row>
  );
};

export default MenuDetail;
