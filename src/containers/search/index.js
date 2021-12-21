import React, { useEffect, useState } from "react";
import { Typography, Row, Input, List, Divider, Col, Empty, Spin } from "antd";
import { URL, SEARCH } from "../../utils/constants";
import { useHistory, Link } from "react-router-dom";

const { Search } = Input;
const { Title, Text } = Typography;
const SearchMenu = (props) => {
  const history = useHistory();
  const item = props?.match?.params?.item;
  const [data, setData] = useState([]);
  const [menus, setMenus] = useState();
  const [restDetail, setRestDetail] = useState();
  const [searchVal, setSearchVal] = useState(item);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (item) {
      handleSearch(item);
    }
  }, []);
  const handleSearch = async (val) => {
    setLoading(true);
    if (val) {
      history.push(`/search/${val}`);
      fetch(`${URL}${SEARCH}?query=${val}`)
        .then((res) => res.json())
        .then((json) => {
          setLoading(false);
          console.log("json----", json);

          setData(json?.items);
          setMenus(json?.menus);
          setRestDetail(json?.restaurants);
        });
    } else {
      setLoading(false);
      history.push(`/search`);
    }
  };

  const renderRestDetails = (item) => {
    let id = item?.menu_id;
    let m_id = menus[id]?.rest_id;
    let rest = restDetail[m_id];

    return (
      <Col span={12}>
        <Row style={{ width: "100%" }}>
          <Text style={{ fontSize: 15 }}>
            <b>Restaurant Name : </b> {rest?.name}
          </Text>
        </Row>

        <Row style={{ width: "100%" }}>
          <Text style={{ fontSize: 15 }}>
            <b>Address : </b> {rest?.address}
          </Text>
        </Row>
      </Col>
    );
  };
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
          width: "60%",
          height: "100%",
          alignSelf: "center",
        }}
      >
        <Search
          placeholder="Search Menu Item"
          style={{ width: "100%" }}
          size="large"
          value={searchVal}
          onSearch={(e) => {
            setSearchVal(e);
            handleSearch(e);
          }}
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
        />
        <Divider />
        {loading === true ? (
          <Row
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
            }}
            justify="center"
          >
            <Spin size="large" />
          </Row>
        ) : data?.length > 0 && restDetail && menus ? (
          <>
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={data}
              style={{ width: "100%" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Link
                      key="list-loadmore-edit"
                      to={`/menu/${item?.menu_id}`}
                    >
                      View Details
                    </Link>,
                  ]}
                >
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <Title level={4}>{item?.name}</Title>
                      <Row style={{ width: "100%" }}>
                        {/* <Text style={{ fontSize: 15 }}>{item?.lower_name}</Text> */}
                      </Row>
                      <Text style={{ fontSize: 15 }}>
                        <b>Price : </b>
                        {item?.price}
                      </Text>
                    </Col>
                    {renderRestDetails(item)}
                  </Row>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Row
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
            }}
            justify="center"
          >
            <Empty
              description={<Text style={{ fontSize: 20 }}>No Data Found</Text>}
            />
          </Row>
        )}
      </Row>
    </Row>
  );
};

export default SearchMenu;
