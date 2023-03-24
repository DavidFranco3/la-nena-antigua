import { useState, useEffect, Suspense } from 'react';
import { listarPaginacionCategoriasActivas, totalCategoriasActivas, listarPaginacionCategoriasCanceladas, totalCategoriasCanceladas } from "../../api/categorias";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import BasicModal from "../../components/Modal/BasicModal";
import ListCategorias from "../../components/Categorias/ListCategorias";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { Spinner, Button, Col, Row, Alert } from "react-bootstrap";
import RegistroCategorias from "../../components/Categorias/RegistroCategorias";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { Switch } from '@headlessui/react'

function Categorias(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    // Para definir el estado del switch
    const [estadoSwitch, setEstadoSwitch] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para la lista de abonos
    const registroCategorias = (content) => {
        setTitulosModal("Registrar una categoría");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar el listado de categorias
    const [listCategorias, setListCategorias] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalCategorias, setNoTotalCategorias] = useState(1);

    useEffect(() => {
        //console.log("Estado del switch ", estadoSwitch)
        try {
            if (estadoSwitch) {
                // Lista los productos activos
                totalCategoriasActivas().then(response => {
                    const { data } = response;
                    setNoTotalCategorias(data)
                }).catch(e => {
                    console.log(e)
                })

                if (page === 0) {
                    setPage(1)

                    listarPaginacionCategoriasActivas(page, rowsPerPage).then(response => {
                        const { data } = response;
                        if (!listCategorias && data) {
                            setListCategorias(formatModelCategorias(data));
                        } else {
                            const datosCategorias = formatModelCategorias(data);
                            setListCategorias(datosCategorias)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                } else {
                    listarPaginacionCategoriasActivas(page, rowsPerPage).then(response => {
                        const { data } = response;
                        //console.log(data)

                        if (!listCategorias && data) {
                            setListCategorias(formatModelCategorias(data));
                        } else {
                            const datosCategorias = formatModelCategorias(data);
                            setListCategorias(datosCategorias)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            } else {
                // Lista los productos obsoletos
                totalCategoriasCanceladas().then(response => {
                    const { data } = response;
                    setNoTotalCategorias(data)
                }).catch(e => {
                    console.log(e)
                })

                if (page === 0) {
                    setPage(1)

                    listarPaginacionCategoriasCanceladas(page, rowsPerPage).then(response => {
                        const { data } = response;
                        if (!listCategorias && data) {
                            setListCategorias(formatModelCategorias(data));
                        } else {
                            const datosCategorias = formatModelCategorias(data);
                            setListCategorias(datosCategorias)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                } else {
                    listarPaginacionCategoriasCanceladas(page, rowsPerPage).then(response => {
                        const { data } = response;
                        //console.log(data)

                        if (!listCategorias && data) {
                            setListCategorias(formatModelCategorias(data));
                        } else {
                            const datosCategorias = formatModelCategorias(data);
                            setListCategorias(datosCategorias)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            }

        } catch (e) {
            console.log(e)
        }
    }, [location, estadoSwitch, page, rowsPerPage]);


    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Categorías</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                title="Registrar una nueva categoría"
                                className="btnRegistro"
                                onClick={() => {
                                    registroCategorias(
                                        <RegistroCategorias
                                            setShowModal={setShowModal}
                                            location={location}
                                            navigate={navigate}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Row>
                <Col xs={12} md={8}>
                    <h3 className="tituloSwitch">Estado de las categorías</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Switch
                        title={estadoSwitch === true ? "Ver categorías canceladas" : "Ver categorías activas"}
                        checked={estadoSwitch}
                        onChange={setEstadoSwitch}
                        className={`${estadoSwitch ? 'bg-teal-900' : 'bg-red-600'}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={`${estadoSwitch ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                        />
                    </Switch>
                </Col>
            </Row>

            {
                listCategorias ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <ListCategorias
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listCategorias={listCategorias}
                                    location={location}
                                    navigate={navigate}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalCategorias={noTotalCategorias}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelCategorias(categorias) {
    const tempCategorias = []
    categorias.forEach((categoria) => {
        tempCategorias.push({
            id: categoria._id,
            nombre: categoria.nombre,
            negocio: categoria.negocio,
            imagen: categoria.imagen,
            estado: categoria.estado,
            fechaCreacion: categoria.createdAt,
            fechaActualizacion: categoria.updatedAt
        });
    });
    return tempCategorias;
}

export default withRouter(Categorias);
