import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  message,
  Row,
  Upload,
  Image,
  List,
  Divider,
  Col,
  Spin,
  Empty,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { URL, GET_REST, UPLOAD } from "../../utils/constants";
const { Title, Text } = Typography;
const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    getMenuDetails();
  }, []);
  const getMenuDetails = () => {
    fetch(`${URL}${GET_REST}?id=${localStorage.getItem("res_id")}`)
      // a6468aa5-1ee5-47fd-9529-79903ae9b8ed
      .then((res) => res.json())
      .then((json) => {
        console.log("json", json);

        setLoading(false);
        setData(json);
      });
  };
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };
  const dummyRequest = ({}) => {};
  const handleFileInputChange = async (e) => {
    // console.log("ee", e?.file?.name);
    let file = e?.file?.originFileObj;
    setUploading(true);
    // setFile(e?.file?.name);

    await getBase64(file)
      .then(async (result) => {
        await handleImageUpload(result, e?.file?.name);
        // setBase64(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImageUpload = async (image, name) => {
    console.log("file name", name);
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        rest_id: data?.id,
        file_name: name,
        image: image,
      }),
    };
    await fetch(`${URL}${UPLOAD}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("upload res", data);
        message.success(data?.message);
        setUploading(false);
        getMenuDetails();
      })
      .catch((err) => {
        message.error(err);
        setUploading(false);
      });
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
      {loading === true ? (
        <Spin size="large" />
      ) : (
        data && (
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
                alignItems: "center",
              }}
            >
              <Title level={3}>Restaurant Name :{data?.name}</Title>
              <Upload
                onChange={(e) => handleFileInputChange(e)}
                customRequest={dummyRequest}
                fileList={[]}
              >
                <Button loading={uploading} icon={<UploadOutlined />}>
                  {uploading === true
                    ? "Uploading Your Menu"
                    : " Upload Your Menu"}
                </Button>
              </Upload>
            </Row>
            <Divider />
            {data?.menus?.length > 0 ? (
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={data?.menus}
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
                    <Row style={{ width: "50%" }}>
                      <Col span={8}>
                        <Row
                          style={{
                            width: "100%",
                            marginBottom: "5%",
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>
                            <b>Menu</b>
                          </Text>
                        </Row>
                        <Row>
                          <Image
                            width={200}
                            src={item?.menu_img}
                            style={{ marginLeft: "18%" }}
                          />
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row
                          style={{
                            width: "100%",
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>
                            <b>QR</b>
                          </Text>
                        </Row>
                        <Row>
                          <Image
                            width={180}
                            src={item?.qr_img}
                            style={{ marginLeft: "15%" }}
                          />
                        </Row>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
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
                  description={
                    <Text style={{ fontSize: 20 }}>No Menus Found</Text>
                  }
                />
              </Row>
            )}
          </Row>
        )
      )}
    </Row>
  );
};

export default Dashboard;
