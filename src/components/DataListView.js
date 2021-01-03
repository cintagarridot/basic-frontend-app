import React, {useState, useEffect} from "react";
import {
    Card,
    CustomInput,
    Badge,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { ContextMenuTrigger } from "react-contextmenu";
import classnames from "classnames";
import withAuth from 'components/withAuth';
import moment from 'moment';
import 'moment/locale/es';
import {Col, Row} from "reactstrap";
import { Link } from 'react-router-dom';
import subjectService from "services/subject-service";
import { confirmAlert } from 'react-confirm-alert';
import documentService from "../services/document-service";
import notificationService from "../services/notification-service";


const DataListView = ({ isSelect, element, subjects, news, usersList, onCheckItem, document, notifications, ...props }) => {

  const [ documentPath, setDocumentPath ] = useState('');
  const [dropdownDocOpen, setDropdownDocOpen] = useState(false);
  const [dropdownEditDoc, setDropdownEditDoc] = useState(false);
  const [editDocId, setEditDocId] = useState('');
  const [docName, setDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const deleteSubject  = (element) => {
    confirmAlert({
      title: 'Borrar '+element.title,
      message: '¿Estás seguro de borrar esta asignatura?',
      buttons: [
          {
              label: 'Borrar',
              onClick: () => {
                subjectService.deleteSubject(element._id);
                window.location.reload();
              }
          },
          {
              label: 'Cancelar',
          }
      ]
  })

  }

  useEffect (() => {
    if(document && element.path) {
      var file_split = element.path.split('\\');
      const file_name = file_split[6];

      setDocumentPath(file_name);
    }
  });

    const deleteDocument = (id) => {
        documentService.deleteDocument(id).then((result) => {
            window.location.reload();
        });
    }

    const toggleDoc = () => {
        setDropdownDocOpen(!dropdownDocOpen);
    }

    const toggleEditDocModal = (id) => {
        setDropdownEditDoc(!dropdownEditDoc);
        setEditDocId(id);
    }

    const handleChangeEditDocName = (event) => {
        const { name, value } = event.target;
        setDocName(value);
    }

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const saveDocument = async () => {

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "file0",
            selectedFile,
        );

        formData.append(
            "title",
            docName,
        );

        toggleEditDocModal();
        return await documentService.editDocument(editDocId, formData).then((result) => {
            window.location.reload();
        });

    }

    const deleteNotification = (notification) => {
        console.log('deleted notifica')
        // return notificationService.deleteNotification(notification._id).then((result) => {
        //     window.location.reload();
        // });
    }

    const openNotification = (notification) => {
        setNotificationOpen(!notificationOpen);
        console.log('notification', notification);
        notificationService.markAsRead(notification._id).then((result) => {
            window.location.reload();
        })
    }

  return (
    <Col xs={'6'} sm={'8'} md={'12'} lg={'12'} xl={'12'} className="mb-5">
      <ContextMenuTrigger id="menu_id" data={element.id}>
        <Card style={ !notifications ? { width: '1000px', height: '90px', fontSize: '16px',
         justifyContent: 'center', padding: '20px', boxShadow: '1px #d4d4d4', borderRadius: '10px'} : notifications && !element.read && !notificationOpen ?
            { width: '1000px', height: '90px', fontSize: '16px',
                justifyContent: 'center', padding: '20px', boxShadow: '1px #d4d4d4', borderRadius: '10px', background: '#ADD8E6'} :
            notifications && element.read ? { width: '1000px', height: '90px', fontSize: '16px',
                justifyContent: 'center', padding: '20px', boxShadow: '1px #d4d4d4', borderRadius: '10px' } : notifications && notificationOpen ?
                {  width: '1000px', height: '250px', fontSize: '16px',
                    justifyContent: 'center', padding: '10px', boxShadow: '1px #d4d4d4', borderRadius: '10px' } : { }
        }
          onClick={event => onCheckItem(event, element.id)}

        >

          {subjects &&
            <>
              <Row xs={'12'} sm={'12'} lg={'12'} xl={'12'} >
                <Col xs={'6'} sm={'6'} lg={'6'} xl={'6'}>
                  <p className="list-item-heading mb-1 truncate">
                    {element.title}
                  </p>
                </Col>


                {props.user.type === 'admin' ?
                <>
                 <Col xs={'2'} sm={'2'} lg={'2'} xl={'2'}>
                  <Link to={'/subject/details/' + element._id} className={'btn btn-primary'} style={{fontSize: '15px'}} >
                    Ver detalles
                  </Link>
                </Col>
                  <Col xs={'2'} sm={'2'} lg={'2'} xl={'2'}>
                    <button className={'btn-danger mt-1'} style={{height: '30px'}} onClick={() => deleteSubject(element)}>Borrar</button>
                  </Col>
                </>
                :(
                  <Col xs={'4'} sm={'4'} lg={'4'} xl={'4'}>
                  <Link to={'/subject/details/' + element._id} className={'btn btn-primary'} style={{fontSize: '15px'}} >
                    Ver detalles
                  </Link>
                </Col>
                  )
                }
              </Row>
            </>
          }

          {news &&
            <>
              <Row>
                <Col xs={"4"}>
                    <p className="list-item-heading mb-1 truncate">
                      {element.title}
                    </p>
                </Col>

                <Col xs={"4"}>
                  <p className="mb-1 text-muted text-small ">
                    {moment(element.date).format('L')}
                  </p>
                </Col>

                <Col xs={"4"} style={{textAlign: 'center'}}>
                  <Link to={'/news/detail/' + element._id} className={'btn btn-primary'} style={{fontSize: '14px'}} >Ver detalles</Link>
                </Col>

              </Row>

            </>
          }

          {usersList &&
            <>
               <Col xs={"4"}>
                <p className="list-item-heading mb-1 truncate">
                  {element.firstName} {element.lastName}
                </p>
             </Col>
             <Col xs={"4"}>
                <p className="list-item-heading mb-1 truncate">
                  {element.username}
                </p>
            </Col>
            </>
          }

          {document &&
            <>
              <Row>
                <Col xs={"6"}>
                    <p className="list-item-heading mb-1 truncate">
                      {element.title}
                    </p>
                </Col>
                <Col xs={"2"}>
                    <p className="list-item-heading mb-1 truncate">
                      {element.user.username}
                    </p>
                </Col>
                <Col xs={'2'}>
                  <p>
                    {moment(element.date).format('L')}
                  </p>
                </Col>
                <Col xs={"2"}>
                    <Dropdown isOpen={dropdownDocOpen} toggle={toggleDoc}>
                        <DropdownToggle caret>
                            Opciones
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <a href={element.secure_url} id="enlaceVerPdf" target="_blank">
                                    Ver
                                </a>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => toggleEditDocModal(element._id)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => deleteDocument(element._id)}>
                                Borrar
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>

              </Row>

                {console.log('selectedFile', selectedFile)}
                {console.log('name', docName)}
                {dropdownEditDoc &&
                    <div>
                        <Modal isOpen={dropdownEditDoc} toggle={toggleEditDocModal} >
                            <ModalHeader>Editar documento</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col xs={'12'}>
                                        <label className={'mt-2'} htmlFor='text'>Nombre del documento</label>
                                    </Col>
                                    <Col xs={'12'}>
                                        <input className={'mt-2 font'} id='text' required='true' type='text' name='docName' defaultValue={element.title} onChange={handleChangeEditDocName} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={'12'}>
                                        <label className={'mt-2'} htmlFor='text'>Suba un pdf</label>
                                    </Col>
                                    <Col xs={'12'}>
                                        <input className={'mt-2 font'} required='true' type='file' name='document' onChange={onFileChange} />
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={saveDocument}>Guardar</Button>{' '}
                                <Button color="secondary" onClick={toggleEditDocModal}>Cancelar</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                }
            </>
          }

            {notifications && !openNotification ? (
            <>
                <Row xs={'12'} sm={'12'} md={'12'} lg={'12'} xl={'12'} >
                    <Col xs={'6'} sm={'6'} lg={'6'} xl={'6'}>
                        <p className="list-item-heading mb-1 truncate">
                            {element.title}
                        </p>
                    </Col>

                    <Col xs={'2'} sm={'2'} lg={'2'} xl={'2'}>
                        <button className={'btn btn-primary'} style={{fontSize: '15px'}}  onClick={() => openNotification(element)}>
                            Ver detalles
                        </button>
                    </Col>
                    <Col xs={'2'} sm={'2'} lg={'2'} xl={'2'}>
                        <button className={'btn-danger mt-1'} style={{height: '30px'}} onClick={() => deleteNotification(element)}>Borrar</button>
                    </Col>

                </Row>
            </>
            ) : notifications && openNotification ? (
                <>
                    <Row xs={'12'} sm={'12'} md={'12'} lg={'12'} xl={'12'} >
                        <Col xs={'6'} sm={'6'} lg={'6'} xl={'6'}>
                            <p className="list-item-heading mb-1 truncate">
                                {element.title}
                            </p>
                        </Col>

                        <Col xs={'2'} sm={'2'} lg={'2'} xl={'2'}>
                            <button className={'btn btn-primary'} style={{fontSize: '15px'}}  onClick={() => openNotification(element)}>
                                Ocultar detalles
                            </button>
                        </Col>
                    </Row>
                    <Row className={'mt-5'}>
                        <Col xs={'6'} md={'8'} sm={'12'} lg={'12'} xl={'12'}>
                            <p className="list-item-heading mb-1 truncate">
                                {element.content}
                            </p>
                        </Col>
                    </Row>
                </>
                ) : ( <></> )
            }

        </Card>
      </ContextMenuTrigger>
    </Col>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(withRouter(withAuth(DataListView)));
