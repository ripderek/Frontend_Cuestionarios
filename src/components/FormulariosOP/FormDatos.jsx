import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export function FormDatos() {
  //cargar los datos del participantes segun el token id de las coockies
  const [DatosParticipante, SetDatosParticipante] = useState([]);
  const [load, setLoader] = useState(true);
  useEffect(() => {
    Registrar_Participante();
  }, []);
  const cookies = new Cookies();
  const router = useRouter();

  const Datos_Participante = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "participantes/DataParticipante/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetDatosParticipante(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //hacer una funcion para que registre al usuario en el test
  //estado para almacenar la info de la seccion
  const [registro_usuario_test, SetRegistro] = useState({
    p_token_id_participante: cookies.get("id_user"),
    p_token_id_test: cookies.get("token_test"),
    p_facultad: "NA",
    p_carrera: "NA",
    p_semestre: "2",
  });

  //funcion para registrar y enviar a otra ruta donde cargaran las secciones y las preguntas
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  const cerrar1 = (valor) => {
    setError(valor);
  };
  //Funcion para registrar al participante en el test
  const Registrar_Participante = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //aqui hay que crear un procedimiento que genere todas las preguntas
      //que va a tener el usuario y las cree en una tabla
      console.log(registro_usuario_test);
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/IngresoParticipanteTest",
        registro_usuario_test,
        {
          withCredentials: true,
        }
      );

      const result2 = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/RegistrarIngreso",
        {
          user_id_token: cookies.get("id_user"),
          test_id_token: cookies.get("token_test"),
          user_age: navigator.userAgent,
        },
        {
          withCredentials: true,
        }
      );
      console.log(result);
      //setLoader(false);
      //si todo salio bien reenviar a otro formulario donde cargaran las secciones del test
      router.push("/FormulariosOP/Test");
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      if (error.response && error.response.data && error.response.data.error) {
        // Si hay un error en la respuesta del servidor, mostrar el mensaje de error del servidor
        setMensajeError(error.response.data.error);
      } else {
        // Si no hay un error específico del servidor, mostrar el mensaje de error general
        setMensajeError(error.message);
      }
      //alert(error.response.data.error);
      setError(true);
    }
  };
  return (
    <div className="mb-6">
      {load ? <Loader /> : ""}
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      ) : (
        ""
      )}
      {/*
      <Card
        color="transparent"
        shadow={false}
        className="mx-auto w-full max-w-[29rem] mt-3 shadow-xl p-6   text-center bg-white items-center justify-center mb-6  rounded-none"
      >
        <Typography variant="h4" color="blue-gray">
          Registrar en el Test
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Para continuar al test complete el siguiente formulario
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={DatosParticipante.r_nombres_apellidos}
              disabled
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={DatosParticipante.r_correo_institucional}
              disabled
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          {load ? (
            ""
          ) : (
            <Button
              className="mt-6 rounded-none bg-light-green-900 font-bold  hover:bg-orange-600"
              fullWidth
              onClick={Registrar_Participante}
            >
              Aceptar
            </Button>
          )}
        </form>
      </Card>
       */}
    </div>
  );
}

export default FormDatos;
