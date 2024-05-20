import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
const TABLE_HEAD = ["Pregunta"];

export function CrearSalto({ id_test, id_seccion, cerrar }) {
  const [load, setLoader] = useState(false);
  //obtener los niveles permitidos para consultar las preguntas
  const [ListaSaltos, SetListaSaltos] = useState([]);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_listar_niveles_saltos_seleccion/" +
          id_test,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetListaSaltos(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  const [PreguntasNivel, SetPreguntasNivel] = useState([]);
  const ObtenerPreguntasNivel = async (id_nivel) => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_preguntas_saltos/" +
          id_nivel,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetPreguntasNivel(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  const HandlerNivel = (nivel, nivelSeleccionado, r_id_nivel) => (
    ObtenerPreguntasNivel(nivel),
    SetNivelSeleccionado(nivelSeleccionado),
    setIdNivelSeleccionado(r_id_nivel)
  );
  const [IdNivelSeleccionado, setIdNivelSeleccionado] = useState(0); //Id Del nivel Seleccionado
  const [NivelSeleccionado, SetNivelSeleccionado] = useState(0); //Numero del nivel para recorrer solo los niveles mayores a este
  const [constAbrirRespuestas, setAbrirRespuestas] = useState(false);
  const [respuestas, SetRespuestas] = useState([]);
  const [idPRegunta, setIDpregunta] = useState(0);
  const [nivelSaltoDestino, setNivelSaltoDestino] = useState(0); //id del nivel donde sera destino el salto
  //Abrir el visor de las opciones de respuesta de la pregunta
  const HandlerRespuestas = (IDPregunta) => {
    setIDpregunta(IDPregunta);
    ObtenerOpcionesRespuestasSaltos(IDPregunta);
  };
  //funcion para cargar las respuestas de las preguntas
  const ObtenerOpcionesRespuestasSaltos = async (idPregunta) => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/RespuestasMEMRZAR/" +
          idPregunta,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetRespuestas(data);
      console.log(data);
      setLoader(false);
      setAbrirRespuestas(true);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  //funcion para registrar el salto de nivel que se realizara al seleccionar la respuesta
  const RegistrarSalto = async (id_opcion_salto) => {
    //IdNivelSeleccionado id del nivel seleccionado para hacer el salto
    //nivelSaltoDestino   id nivel destino del salto
    //idPRegunta          id de la pregunta que realizara el salto
    //id_opcion_salto     id de la opcion que realizara el salto
    //id_test             id del test actual para hacer el salto
    //id_seccion          id de la seccion que realiza el salto
    const InfoSalto = {
      p_NivelOrigen: IdNivelSeleccionado,
      p_NivelDestino: nivelSaltoDestino,
      p_IdPregunta: idPRegunta,
      p_IdOpcionSalto: id_opcion_salto,
      p_IdTest: id_test,
      p_IdSeccion: id_seccion,
    };

    if (nivelSaltoDestino === 0) alert("Seleccione un nivel de destino");
    else {
      setLoader(true);
      try {
        //ahora enviar el id del test, id de la seccion y Json con los niveles
        const result = await axios.post(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "test/SP_registrar_salto_nivel_test",
          InfoSalto,
          {
            withCredentials: true,
          }
        );
        setLoader(false);
        //Cuando se cierre la ventana hay que poner en 0 el idNivelSeleccionado y el nivelSaltoDestino
        setNivelSaltoDestino(0);
        //cerrar todas las ventanas para ver el salto creado en la lista
        cerrar();
      } catch (error) {
        setLoader(false);
        console.log(error);
        alert("Error");
      }
    }
  };
  return (
    <>
      <Dialog open={true} handler={cerrar}>
        {load && <Loader />}
        {/*Dialog para ver las respuestas para crear un salto de nivel*/}
        <Dialog
          open={constAbrirRespuestas}
          handler={() => setAbrirRespuestas(false)}
        >
          <DialogBody>
            <Typography variant="h4" color="blue-gray">
              Seleccionar Op
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={() => setAbrirRespuestas(false)}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>
            {/* NIVELES PREVIAMENTE CARGADOS PARA REUTILIZARLOS Y SOLO MOSTRAR LOS NIVELES MAYORES AL SELECCIONADO PARA DAR EL SALTO */}
            <div className="flex-row mx-auto text-center bg-white mt-5">
              <Typography variant="h6" color="blue-gray">
                Nivel Origen: {NivelSeleccionado}
              </Typography>
              <Select label="Nivel destino">
                {ListaSaltos &&
                  ListaSaltos.length > 0 &&
                  ListaSaltos.filter(
                    ({ r_nivel }) => NivelSeleccionado < r_nivel
                  ).map(
                    (
                      {
                        r_id_test_niveles,
                        r_id_nivel,
                        r_nivel,
                        r_id_test_secciones,
                      },
                      index
                    ) => (
                      <Option
                        key={index}
                        value={r_id_nivel}
                        onClick={() => setNivelSaltoDestino(r_id_nivel)}
                      >
                        Nivel: {r_nivel}
                      </Option>
                    )
                  )}
              </Select>
            </div>
            <div>
              {respuestas.length === 0 ? (
                ""
              ) : (
                <div>
                  <div className="h-96 overflow-x-scroll mt-4">
                    <table className="w-full   table-auto text-left">
                      <thead>
                        <tr>
                          {TABLE_HEAD.map((head) => (
                            <th
                              key={head}
                              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                {"Opcion"}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {respuestas.map(
                          ({ r_id_repuesta, r_opcion }, index) => {
                            const isLast = index === respuestas.length - 1;
                            const classes = isLast
                              ? "p-2"
                              : "p-2 border-b border-blue-gray-50";

                            return (
                              <tr
                                key={r_id_repuesta}
                                className="hover:bg-yellow-300 cursor-pointer"
                              >
                                {/* CUando se de click en una opcion se crear un salto de nivel */}
                                <td
                                  className={classes}
                                  onClick={() => RegistrarSalto(r_id_repuesta)}
                                >
                                  {r_opcion}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </DialogBody>
        </Dialog>
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Crear Salto
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <div className="flex-row mx-auto text-center bg-white mt-5">
            {/* CUANO SE SELECCIONE UN NIVEL SE TIENEN QUE CARGAR LAS PREGUNTAS DE ESE NIVEL PARA CREAR UN SALTO*/}
            <Select label="Seleccione un nivel">
              {ListaSaltos.map(
                (
                  {
                    r_id_test_niveles,
                    r_id_nivel,
                    r_nivel,
                    r_id_test_secciones,
                  },
                  index
                ) => (
                  <Option
                    onClick={() =>
                      HandlerNivel(r_id_test_niveles, r_nivel, r_id_nivel)
                    }
                    key={index}
                  >
                    Nivel: {r_nivel}
                  </Option>
                )
              )}
            </Select>
          </div>
          <div>
            {PreguntasNivel.length === 0 ? (
              ""
            ) : (
              <div>
                <div className="h-96 overflow-x-scroll mt-4">
                  <table className="w-full   table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th
                            key={head}
                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PreguntasNivel.map(
                        ({ r_enunciado, r_id_pregunta, r_id_nivel }, index) => {
                          const isLast = index === PreguntasNivel.length - 1;
                          const classes = isLast
                            ? "p-2"
                            : "p-2 border-b border-blue-gray-50";

                          return (
                            <tr
                              key={r_id_pregunta}
                              className="hover:bg-yellow-300 cursor-pointer"
                            >
                              {/* AL DAR CLICK SE DEBEN VER LAS RESPUESTAS PARA SELECCIONAR Y DAR SALTOS */}
                              <td
                                className={classes}
                                onClick={() => HandlerRespuestas(r_id_pregunta)}
                              >
                                {r_enunciado}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
export default CrearSalto;
