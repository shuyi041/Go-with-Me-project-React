import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Style from './post.module.css';
import BlogBanner from '@/components/ui/blogBanner/blogBanner';
import { Col, Row, ConfigProvider } from 'antd';
import BlogSidebar from '@/components/ui/blogSidebar/blogSidebar';
import PostNavPure from '@/components/ui/postNavPure/postNavPure';
import BlogBoardNav from '@/components/ui/blogBoardNav/blogBoardNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faFileLines,
  faImage,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import MainBtn from '@/components/ui/buttons/MainBtn';
import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn';
import AuthContext from '@/context/AuthContext';
// Ant design 輸入文字
import { Input, Form, Select, Space } from 'antd';
import ModalCancel from '@/components/ui/modal/modal_delete';
const { TextArea } = Input;

// Ant design 上傳圖片
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function Post() {
  const { auth, setAuth } = useContext(AuthContext);
  // 動態路由
  const router = useRouter();
  //紀錄body要放的東西：
  // 看板 (已做)
  const [boardSid, setBoardSid] = useState(1);
  // 文章標題 (onChange)
  const [title, setTitle] = useState('');
  // 文章內容 (onChange)
  const [content, setContent] = useState('');
  const [value, setValue] = useState('');
  // 選到的話題 (要click到的hashtag -> onclick)
  const [choseHashtag, setChoseHashtag] = useState([]);

  // console.log(auth.id);

  // 提交表单到后端的函数
  const submitForm = (values, directTo) => {
    // console.log(values);

    fetch(`${process.env.API_SERVER}/forum-api/forum/blog/post`, {
      method: 'POST',
      body: values,
    })
      .then((r) => r.json())
      .then((data) => {
        // console.log('data', data);
        // console.log(data.mySid);
        // 根据后端返回的数据来处理结果
        if (directTo) {
          router.push(`/forum/blog/draft`);
        } else {
          router.push(`/forum/${data.mySid}`);
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
  };

  // 发布文章
  const handlePublish = () => {
    // console.log('clicked');
    const formData = new FormData();

    // console.log({formData});
    //将需要提交的数据添加到 formData 中
    // formData.append('postid', postid);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('memberSid', auth.id);
    formData.append('boardSid', boardSid);
    formData.append('choseHashtag', choseHashtag);
    console.log('choseHashtag', choseHashtag);
    fileList.forEach((file) => {
      formData.append('photo', file.originFileObj);
    });
    formData.append('postStatus', 0); // 設置發布狀態為已發佈 (0) 或草稿 (1)
    submitForm(formData, 0); // 提交表单
    console.log('publish_formData', formData);
    // router.push(`/forum/${postid}`)
  };

  // 儲存草稿夾
  const handleDraft = () => {
    const formData = new FormData();
    // 將需要提交的數據添加到 formData 中
    // formData.append('postid', postid);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('memberSid', auth.id);
    formData.append('boardSid', boardSid);
    formData.append('choseHashtag', choseHashtag);
    fileList.forEach((file) => {
      formData.append('photo', file.originFileObj);
    });
    formData.append('postStatus', 1); // 設置發布狀態為已發佈 (0) 或草稿 (1)
    submitForm(formData, 1); // 提交表單
    console.log('draft_formData', formData);
    // router.push(`/forum/blog/draft`)
  };

  // Ant design上傳圖片
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  // Antd 點選看板篩選話題
  const antTag = {
    doctor: [
      { label: '寵物健康', value: '寵物健康' },
      { label: '寵物醫療', value: '寵物醫療' },
      { label: '寵物醫生', value: '寵物醫生' },
      { label: '寵物保健', value: '寵物保健' },
      { label: '寵物疾病', value: '寵物疾病' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    home: [
      { label: '寵物度假', value: '寵物度假' },
      { label: '寵物住宿', value: '寵物住宿' },
      { label: '寵物旅館', value: '寵物旅館' },
      { label: '寵物寄宿', value: '寵物寄宿' },
      { label: '寵物民宿', value: '寵物民宿' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    site: [
      { label: '寵物遊樂場', value: '寵物遊樂場' },
      { label: '寵物友善', value: '寵物友善' },
      { label: '寵物戶外活動', value: '寵物戶外活動' },
      { label: '寵物旅遊', value: '寵物旅遊' },
      { label: '寵物生態園區', value: '寵物生態園區' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    salon: [
      { label: '寵物造型', value: '寵物造型' },
      { label: '寵物美容', value: '寵物美容' },
      { label: '寵物洗澡', value: '寵物洗澡' },
      { label: '寵物SPA', value: '寵物SPA' },
      { label: '寵物美髮', value: '寵物美髮' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    hang: [
      { label: '狗聚會', value: '狗聚會' },
      { label: '貓聚會', value: '貓聚會' },
      { label: '寵物社交', value: '寵物社交' },
      { label: '狗狗交友', value: '狗狗交友' },
      { label: '貓咪聚會', value: '貓咪聚會' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    diary: [
      { label: '寵物日記', value: '寵物日記' },
      { label: '毛孩生活', value: '毛孩生活' },
      { label: '寵物趣事', value: '寵物趣事' },
      { label: '寵物家居', value: '寵物家居' },
      { label: '毛孩故事', value: '毛孩故事' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    school: [
      { label: '寵物培訓', value: '寵物培訓' },
      { label: '寵物學習', value: '寵物學習' },
      { label: '寵物教育', value: '寵物教育' },
      { label: '寵物訓練', value: '寵物訓練' },
      { label: '寵物行為', value: '寵物行為' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    restaurant: [
      { label: '寵物餐廳', value: '寵物餐廳' },
      { label: '寵物用餐', value: '寵物用餐' },
      { label: '寵物友善餐廳', value: '寵物友善餐廳' },
      { label: '寵物美食', value: '寵物美食' },
      { label: '寵物餐點', value: '寵物餐點' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    product: [
      { label: '寵物用品', value: '寵物用品' },
      { label: '寵物推薦', value: '寵物推薦' },
      { label: '寵物好物', value: '寵物好物' },
      { label: '寵物生活用品', value: '寵物生活用品' },
      { label: '寵物商品', value: '寵物商品' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    young: [
      { label: '幼犬', value: '幼犬' },
      { label: '幼貓', value: '幼貓' },
      { label: '寵物新生活', value: '寵物新生活' },
      { label: '寵物小寶貝', value: '寵物小寶貝' },
      { label: '寵物幼寵成長', value: '寵物幼寵成長' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
    old: [
      { label: '老犬', value: '老犬' },
      { label: '老貓', value: '老貓' },
      { label: '寵物晚年', value: '寵物晚年' },
      { label: '寵物老年生活', value: '寵物老年生活' },
      { label: '老寵愛護', value: '老寵愛護' },
      { label: '寵物', value: '寵物' },
      { label: '毛小孩', value: '毛小孩' },
    ],
  };
  const [options, setOptions] = useState([]);

  const handleChangeTag = (value) => {
    setChoseHashtag(value);
    // console.log(`selected ${value}`);
  };

  const changeBoardSid = (boardSid) => {
    // console.log('inchangebs function, ', boardSid);
    switch (boardSid) {
      case 1:
        setOptions(antTag.doctor);
        break;
      case 2:
        setOptions(antTag.home);
        break;
      case 3:
        setOptions(antTag.site);
        break;
      case 4:
        setOptions(antTag.salon);
        break;
      case 5:
        setOptions(antTag.hang);
        break;
      case 6:
        setOptions(antTag.diary);
        break;
      case 7:
        setOptions(antTag.school);
        break;
      case 8:
        setOptions(antTag.restaurant);
        break;
      case 9:
        setOptions(antTag.product);
        break;
      case 11:
        setOptions(antTag.young);
        break;
      case 12:
        setOptions(antTag.old);
        break;
    }
    setBoardSid(boardSid);
  };
  // 編輯文章title跟content
  const editTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };
  const editContent = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };
  // console.log('auth.id',auth.id);
  const leave = () => {
    // console.log('click');
    // e.preventDefault();
    if (auth.id) {
      router.push(`/forum/blog`);
    } else {
      console.log('failed');
    }
  };

  return (
    <>
      <Head>
        <title>狗with咪 | 發佈文章</title>
      </Head>
      <div className="container-outer">
        <div className={Style.body}>
          <BlogBanner />
          <Row className={Style.antRow}>
            <Col span={6}>
              <BlogSidebar
                profile="/forum_img/9509de8d-407e-47c0-a500-b1cf4a27c919.jpg"
                memberName="潘彥廷"
              />
            </Col>
            <Col span={16} className={Style.rightBlock}>
              <div className={Style.blogContent}>
                <Form onFinish={submitForm}>
                  <PostNavPure postNav="發佈文章" />
                  <div className={Style.postContent}>
                    <div className={Style.label}>
                      <FontAwesomeIcon
                        className={Style.icon}
                        icon={faLayerGroup}
                        style={{ maxWidth: 20, maxHeight: 20 }}
                      />
                      <p>選擇發文看板</p>
                    </div>
                    <BlogBoardNav
                      className={Style.board}
                      changeBoardSid={changeBoardSid}
                      boardSid={boardSid}
                    />
                    <div className={Style.post}>
                      <div className={Style.label}>
                        <FontAwesomeIcon
                          className={Style.icon}
                          icon={faFileLines}
                          style={{ maxWidth: 20, maxHeight: 20 }}
                        />
                        <p>發佈文章內容</p>
                      </div>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: '#FD8C46',
                            colorText: 'rgb(81, 81, 81)',
                            fontSize: 16,
                            controlInteractiveSize: 18,
                          },
                        }}
                      >
                        <div className={Style.titleCenter}>
                          <Input
                            placeholder="文章標題"
                            value={title}
                            onChange={editTitle}
                            className={Style.title}
                          />
                        </div>
                        <div className={Style.titleCenter}>
                          <TextArea
                            rows={20}
                            placeholder="撰寫新文章內容"
                            value={content}
                            onChange={editContent}
                            className={Style.content}
                          />
                        </div>
                        <div className={Style.fileLabel}>
                          <FontAwesomeIcon
                            className={Style.icon}
                            icon={faImage}
                            style={{ maxWidth: 20, maxHeight: 20 }}
                          />
                          <p>新增相片</p>
                        </div>
                        <Form.Item name={'photo'}>
                          <Upload
                            className={Style.file}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                          >
                            {fileList.length >= 8 ? null : uploadButton}
                          </Upload>
                          <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                          >
                            <img
                              alt="example"
                              style={{
                                width: '100%',
                              }}
                              src={previewImage}
                            />
                          </Modal>
                        </Form.Item>
                        <div className={Style.label}>
                          <FontAwesomeIcon
                            className={Style.icon}
                            icon={faHashtag}
                            style={{ maxWidth: 20, maxHeight: 20 }}
                          />
                          <p>新增話題</p>
                        </div>
                        <div className={Style.hashtag}>
                          <Space
                            style={{
                              width: '95%',
                            }}
                            direction="vertical"
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              style={{
                                width: '95%',
                              }}
                              placeholder="選擇話題"
                              onChange={handleChangeTag}
                              options={options}
                            />
                          </Space>
                        </div>
                      </ConfigProvider>

                      <div className={Style.btn}>
                        <div className={Style.bbb}>
                          <MainBtn
                            text="發佈文章"
                            clickHandler={handlePublish}
                          />
                        </div>
                        <div className={Style.bbb}>
                          <MainBtn
                            text="儲存至草稿夾"
                            clickHandler={handleDraft}
                          />
                        </div>
                        <div className={Style.bbb}>
                          {/* <SecondaryBtn text = '取消'/>  */}
                          <ModalCancel
                            btnType="secondary"
                            btnText="取消"
                            content="文章尚未編輯完，確定要離開嗎？"
                            confirmHandler={leave}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
