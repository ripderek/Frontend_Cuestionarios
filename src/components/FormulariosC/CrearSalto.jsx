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
  const HandlerNivel = (nivel) => ObtenerPreguntasNivel(nivel);
  const [constAbrirRespuestas, setAbrirRespuestas] = useState(false);
  const [respuestas, SetRespuestas] = useState([]);
  const [idPRegunta, setIDpregunta] = useState(0);
  return (
    <>
      <Dialog open={true} handler={cerrar}>
        {load && <Loader />}
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
                    onClick={() => HandlerNivel(r_id_test_niveles)}
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
                  <table className="w-auto mx-auto  table-auto text-left">
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
                              <td className={classes}>{r_enunciado}</td>
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
