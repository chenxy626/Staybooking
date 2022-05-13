import {
    message,
    Tabs,
    List,
    Card,
    Image,
    Carousel,
    Button,
    Tooltip,
    Space,
    Modal,
  } from "antd";
import {
    LeftCircleFilled,
    RightCircleFilled,
    InfoCircleOutlined,
  } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { deleteStay, getStaysByHost, getReservationsByStay } from "../utils";
import UploadStay from "./UploadStay";

const { TabPane } = Tabs;

export class StayDetailInfoButton extends React.Component {
    state = {
      modalVisible: false,
    };
   
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
   
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
   
    render() {
      const { stay } = this.props;
      const { name, description, address, guest_number } = stay;
      const { modalVisible } = this.state;
      return (
        <>
          {/* tooltip + modal是鼠标点开这个图标才会看到弹窗 */}
          <Tooltip title="View Stay Details"> 
            <Button
              onClick={this.openModal}
              style={{ border: "none" }}
              size="large"
              icon={<InfoCircleOutlined />}
            />
          </Tooltip>
          {modalVisible && (
            <Modal
              title={name}
              centered={true}
              visible={modalVisible}
              closable={false} //要不要在右上角给一个小叉叉
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong={true}>Description</Text>
                <Text type="secondary">{description}</Text>
                <Text strong={true}>Address</Text>
                <Text type="secondary">{address}</Text>
                <Text strong={true}>Guest Number</Text>
                <Text type="secondary">{guest_number}</Text>
              </Space>
            </Modal>
          )}
        </>
      );
    }
  }

class RemoveStayButton extends React.Component {
  state = {
    loading: false,
  };
 
  handleRemoveStay = async () => {
    const { stay, onRemoveSuccess } = this.props; //stay和on
    // 等价于底下两行，书写方便，props传自于line 185
    // const stay = this.props.stay;
    // const onRemoveSuccess = this.props.onRemoveSuccess;
    this.setState({
      loading: true,
    });
 
    try {
      await deleteStay(stay.id);
      onRemoveSuccess();
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveStay}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Stay
      </Button>
    );
  }
}

class ReservationList extends React.Component {
  state = {
    loading: false,
    reservations: [],
  };
 
  componentDidMount() {
    this.loadData();
  }
 
  loadData = async () => {
    this.setState({
      loading: true,
    });
 
    try {
      const resp = await getReservationsByStay(this.props.stayId);
      this.setState({
        reservations: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  render() {
    const { loading, reservations } = this.state;
 
    return (
      <List
        loading={loading}
        dataSource={reservations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>Guest Name: {item.guest.username}</Text>}
              description={
                <>
                  <Text>Checkin Date: {item.checkin_date}</Text>
                  <br />
                  <Text>Checkout Date: {item.checkout_date}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}

class ViewReservationsButton extends React.Component {
  state = {
    modalVisible: false,
  };
 
  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
 
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
 
  render() {
    const { stay } = this.props;
    const { modalVisible } = this.state;
 
    const modalTitle = `Reservations of ${stay.name}`;
 
    return (
      <>
        <Button onClick={this.openModal} shape="round" >
          View Reservations
        </Button>
        {modalVisible && (
          <Modal
            title={modalTitle}
            centered={true}
            visible={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList stayId={stay.id} />
          </Modal>
        )}
      </>
    );
  }
}

class MyStays extends React.Component {
    state = {
      loading: false,
      data: [],
    };
   
    componentDidMount() {
      this.loadData();
    }
   
    loadData = async () => {
      this.setState({
        loading: true,
      });
 
      try {
        const resp = await getStaysByHost(); //发送请求
        this.setState({ //请求成功返回数据
          data: resp,
        });
      } catch (error) {
        message.error(error.message); //请求失败返回message
      } finally {
        this.setState({
          loading: false, //把loading（转圈的UI）停掉
        });
      }
    };
   
    render() {
      return (
        <List
          loading={this.state.loading} // loading（有一个转圈圈的效果）是list的一个component
          grid={{ //grid下这几个配置是指针对不同的屏幕行列最多可以放几张图
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id} //帮助识别grid中每个卡片的独特性，方便调整排序等等
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                      {item.name}
                    </Text>
                    <StayDetailInfoButton stay={item} />
                  </div>
                }
                actions={[<ViewReservationsButton stay={item} />]}
                extra={<RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />}
              >
                {
                  <Carousel //卡片内容, 旋转木马加左右箭头调整效果
                    dots={false}
                    arrows={true}
                    prevArrow={<LeftCircleFilled />}
                    nextArrow={<RightCircleFilled />}
                  >
                    {item.images.map((image, index) => (
                      <div key={index}>
                        <Image src={image.url} width="100%" />
                      </div>
                    ))}
                  </Carousel>
                }
              </Card>
            </List.Item>
          )}
        />
      );
    }
}
    
class HostHomePage extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}> 
      {/* destroyInactiveTabPane控制当切换TabPane的时候，之前的tab会不会在DOM tree中被destroy掉，
        即每次切换走了之后，之前的tab会unmount，再切换回来之后会再mount，mount的时间点会初始化并重新拉取数据 */}
        <TabPane tab="My Stays" key="1">
            <MyStays />
        </TabPane>
        <TabPane tab="Upload Stay" key="2">
            <UploadStay />
        </TabPane>
      </Tabs>

    );
  }
}
 
export default HostHomePage;