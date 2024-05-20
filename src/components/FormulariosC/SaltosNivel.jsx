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
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const TABLE_HEAD = ["Nivel Inicial", "Nivel Salto", ""];
import { VerDetalleSalto, CrearSalto } from "@/components/FormulariosC";

export function SaltosNivel({ id_test, cerrar, id_seccion }) {
  //cargar los niveles que son diferentes de 0 las preguntas
  const [load, setLoader] = useState(false);
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
          "test/fu_listar_saltos_seccion/" +
          id_test +
          "/" +
          id_seccion,
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
  //funcion para ver la pregunta que contiene  el salto de nivel con la opcion
  //enviar el id_test_, id_seccion_ , id_nivel incia y luego retornar la wea fobe
  const [VerSalto, SetVerSalto] = useState(false);
  const [Nivel, SetNivel] = useState(0);
  const [SaltoNivel, setSaltoNivel] = useState(0);
  const [Pregunta, setPregunta] = useState(0);
  const [Respuesta, setrespuesta] = useState(0);
  const HandleVerSalto = (id_nviel_sa, salto, pre, resp) => {
    SetNivel(id_nviel_sa);
    setSaltoNivel(salto);
    setPregunta(pre);
    setrespuesta(resp);
    SetVerSalto(true);
  };
  const [CrearSalto2, setCrearSalto] = useState(false);

  //eliminar el salto de nivel
  const EliminarSalto = async (
    IdNivelSeleccionado,
    nivelSaltoDestino,
    idPRegunta,
    id_opcion_salto,
    id_test,
    id_seccion
  ) => {
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

    setLoader(true);
    try {
      //ahora enviar el id del test, id de la seccion y Json con los niveles
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/SP_Eliminar_Salto_Nivel",
        InfoSalto,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      Obtener_Secciones_Usuario();
    } catch (error) {
      setLoader(false);
      console.log(error);
      alert("Error");
    }
  };
  return (
    <>
      <Dialog open={true} handler={cerrar}>
        {load && <Loader />}
        {/* PARA CREAR SALTOS DE NIVEL */}
        {CrearSalto2 ? (
          <CrearSalto
            id_test={id_test}
            id_seccion={id_seccion}
            cerrar={() => (setCrearSalto(false), Obtener_Secciones_Usuario())}
          />
        ) : (
          ""
        )}
        {/* PARA VER EL DETALLE DEL SALTO QUE SE VA A DAR POR NIVEL*/}
        {VerSalto ? (
          <VerDetalleSalto
            idtest={id_test}
            idnivel={Nivel}
            iidsecciontest={id_seccion}
            nivelSalto={SaltoNivel}
            cerrar={() => SetVerSalto(false)}
            pregunta={Pregunta}
            respuesta={Respuesta}
          />
        ) : (
          ""
        )}
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Saltos de niveles
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <div className="flex-row mx-auto text-center bg-white">
            <IconButton
              className="mx-auto bg-white"
              onClick={() => setCrearSalto(true)}
            >
              <PlusCircleIcon className="w-16" color="green" />
            </IconButton>
          </div>
          {ListaSaltos.length !== 0 && (
            <div className="h-96 overflow-y-auto mt-5">
              <table className="w-full   table-auto text-center">
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
                  {ListaSaltos.map(
                    (
                      {
                        r_id_nivel,
                        r_nivel,
                        r_nivel_salto,
                        r_id_test,
                        r_id_nivel_origin,
                        r_id_pregunta,
                        r_id_nivel_salto,
                        r_id_opcion_respuesta,
                        r_id_seccion_test,
                      },
                      index
                    ) => {
                      const isLast = index === ListaSaltos.length - 1;
                      const classes = isLast
                        ? "p-2"
                        : "p-2 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Nivel {r_nivel}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Nivel {r_nivel_salto}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <IconButton
                              className="mx-auto bg-white"
                              onClick={() =>
                                HandleVerSalto(
                                  r_id_nivel,
                                  r_nivel_salto,
                                  r_id_pregunta,
                                  r_id_opcion_respuesta
                                )
                              }
                            >
                              <EyeIcon className="w-11" color="green" />
                            </IconButton>
                            <IconButton
                              className="mx-auto bg-white ml-7"
                              onClick={() =>
                                EliminarSalto(
                                  r_id_nivel_origin,
                                  r_id_nivel_salto,
                                  r_id_pregunta,
                                  r_id_opcion_respuesta,
                                  r_id_test,
                                  r_id_seccion_test
                                )
                              }
                            >
                              <TrashIcon className="w-11" color="red" />
                            </IconButton>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
}
export default SaltosNivel;
