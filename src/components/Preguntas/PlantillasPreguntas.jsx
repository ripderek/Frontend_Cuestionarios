import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { CrearSeccion } from "@/components/OpcionesSecciones";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import {
  ArrowLeftOnRectangleIcon,
  IdentificationIcon,
  PhotoIcon,
  ClockIcon,
  MinusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
export  function PlantillasPreguntas({
  id_tipo,
  titulo_tipo,
  id_niv,
  AbrirCreador,
  cambiarPestañas,

  // AbrirMEMRZAR,
  //AbrirSELCIMG,
  // AbrirSELCCLA,
}) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const crear = (value) => {
    setOpenAlert(value);
  };

  //estado para abrir el modal para crear una seccion
  const [openCreate, setOpenCreate] = useState(false);
  const cerrar = (value) => {
    setOpenCreate(value);
    Obtener_Secciones_Usuario();
  };
  //estado para almacenar todas las secciones del usuario
  const [secciones, setSecciones] = useState([]);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  //funcion para cargar las secciones que tiene el usuario obteniendo su id de la cookie
  const Obtener_Secciones_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/Plantillas/" + id_tipo,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSecciones(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  //funcion para abrir el editor de una pregunta xd
  const AbrirEditor = (r_id_tipo_pregunta, r_icono, r_codigo) => {
    //alert("Pregunta a creer " + r_codigo);
    AbrirCreador(r_codigo, r_id_tipo_pregunta, r_icono);
    //AbrirMEMRZAR(r_id_tipo_pregunta, r_icono)
    //console.log(r_id_tipo_pregunta, r_icono, r_codigo);
    //if (r_codigo === "MEMRZAR") AbrirMEMRZAR(r_id_tipo_pregunta, r_icono);
    /*
    switch (r_codigo) {
      case "MEMRZAR":
        AbrirMEMRZAR(r_id_tipo_pregunta, r_icono);
        break;
      case "SELCIMG":
        AbrirSELCIMG(r_id_tipo_pregunta, r_icono);
        break;
      case "SELCCLA":
        AbrirSELCCLA(r_id_tipo_pregunta, r_icono);
        break;
      case "LOCIMG":
        alert("Nuevo Tipo");
        break;
      // Agregar las demas plantillas de ser necesario
      default:
        break;
    }
    */
  };
  const sidenavTypes = {
    dark: "bg-green-900 ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const sidenavColors = {
    white: "border-gray-500",
    dark: "border-gray-600",
    green: "border-lime-600",
    orange: "border-orange-600",
    red: "border-red-600",
    pink: "border-pink-600",
  };
  const shadows = {
    white: "shadow-gray-500",
    dark: "shadow-gray-600",
    green: "shadow-lime-600",
    orange: "shadow-orange-600",
    red: "shadow-red-600",
    pink: "shadow-pink-600",
  };
  return (
    <Card className="h-full w-full rounded-none">
      {load ? <Loader /> : ""}
      <CrearSeccion abrir={openCreate} cerrar={cerrar} crear={crear} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de plantillas
            </Typography>

            {/* <Typography color="gray" className="mt-1 font-normal">
              Lista de plantillas para {titulo_tipo}
            </Typography> */}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={() => cambiarPestañas("openPreguntas")}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* 
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            
            <Button variant="outlined" size="sm">
              Todo
            </Button>
            
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={() => setOpenCreate(true)}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Seccion
            </Button>
            
          </div>
          */}
        {/* 
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          
          <div className="w-full md:w-72">
            <Input
              label="Buscar"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
        */}
      </CardHeader>
      <CardBody className=" px-0">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 ml-5"
        >
          Numero de plantillas:
          <span className="font-bold">{" " + secciones.length}</span>
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          {secciones.map(
            ({
              r_id_tipo_pregunta,
              r_titulo,
              r_descripcion,
              r_icono,
              r_codigo,
              r_enunciado_img,
              r_opciones_img,
              r_tiempo_enunciado,
              r_tiempo_respuesta,
              r_opcion_multiple,
            }) => (
              <div
                key={r_id_tipo_pregunta}
                className={`bg-blue-gray-50  rounded-none cursor-pointer hover:border-4 ${sidenavColors[sidenavColor]}  ${shadows[sidenavColor]}`}
                onClick={() =>
                  AbrirEditor(r_id_tipo_pregunta, r_icono, r_codigo)
                }
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <Chip
                      className="w-20 text-center mt-1 ml-1"
                      color="amber"
                      value={r_codigo}
                    />
                    <div className="text-center">
                      {/*src={
                                      process.env.NEXT_PUBLIC_ACCESLINK +
                                      "area/Areaimagen/" +
                                      area_id
                                    } */}
                      <img
                        src={
                          process.env.NEXT_PUBLIC_ACCESLINK +
                          "preguntas/Icono/" +
                          r_icono
                        }
                        alt={r_titulo}
                        className="mt-3 h-52 w-auto mx-auto"
                      />
                    </div>
                    <div className="w-full p-2">
                      <input
                        className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 "
                        disabled
                        value={r_titulo}
                      />
                    </div>

                    <div className="m-2 text-blue-gray-800">
                      {r_descripcion}
                    </div>
                    <div className="flex">
                      {/* Si el enunciado es de tipo imagen */}
                      {r_enunciado_img && (
                        <Tooltip content="Imagen enunciado">
                          <Chip
                            className="w-9 flex h-8 items-center text-center mb-1 ml-1"
                            color="blue"
                            icon={
                              <IdentificationIcon className="mx-auto text-center" />
                            }
                          />
                        </Tooltip>
                      )}
                      {/* Si las opciones de tipo imagen */}
                      {r_opciones_img && (
                        <Tooltip content="Imagen opcion">
                          <Chip
                            className="w-9 flex h-8 items-center text-center mb-1 ml-1"
                            color="cyan"
                            icon={<PhotoIcon className="mx-auto text-center" />}
                          />
                        </Tooltip>
                      )}
                      {/* Si el enunciado tiene tiempo */}
                      {r_tiempo_enunciado && (
                        <Tooltip content="Tiempo enunciado">
                          <Chip
                            className="w-9 flex h-8 items-center text-center mb-1 ml-1"
                            color="light-green"
                            icon={<ClockIcon className="mx-auto text-center" />}
                          />
                        </Tooltip>
                      )}
                      {/* Si las opciones tiene tiempo */}
                      {r_tiempo_respuesta && (
                        <Tooltip content="Tiempo opciones">
                          <Chip
                            className="w-9 flex h-8 items-center text-center mb-1 ml-1"
                            color="indigo"
                            icon={<ClockIcon className="mx-auto text-center" />}
                          />
                        </Tooltip>
                      )}
                      <Tooltip
                        content={
                          r_opcion_multiple ? "Opcion Multiple" : "Opcion Unica"
                        }
                      >
                        <Chip
                          className="w-9 flex h-8 items-center text-center mb-1 ml-1"
                          color={r_opcion_multiple ? "green" : "yellow"}
                          icon={
                            r_opcion_multiple ? (
                              <ListBulletIcon className="mx-auto text-center" />
                            ) : (
                              <MinusIcon className="mx-auto text-center" />
                            )
                          }
                        />
                      </Tooltip>
                    </div>
                    {/* 
                    <ClockIcon className="mx-auto text-center" />
                    MinusIcon,
  ListBulletIcon
                    <div className="p-2 flex justify-end">
                      <Tooltip content="Crear pregunta con esta plantilla">
                        <button className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer font-bold text-white">
                          {/*  <ArrowRightCircleIcon className="w-7" color="white" />
                          Utilizar
                        </button>
                      </Tooltip>
                    </div>
                    */}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Pagina 1 de 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Anterior
          </Button>
          <Button variant="outlined" size="sm">
            Siguiente
          </Button>
        </div>
      </CardFooter>
      <Notification mensaje="Seccion creada" abrir={openAlert} crear={crear} />
    </Card>
  );
}
export default PlantillasPreguntas;