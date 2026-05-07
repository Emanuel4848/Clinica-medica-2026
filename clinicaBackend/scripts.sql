CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    id_rol INT NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE paciente (
    id_paciente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    dpi VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL
);


INSERT INTO rol (nombre_rol) VALUES
('Administrador'),
('Recepcionista'),
('Doctor');



INSERT INTO usuario (username, password, estado, id_rol)
VALUES ('admin', '123456', 'activo', 1);


CREATE TABLE doctor (
    id_doctor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    id_usuario INT UNIQUE,
    CONSTRAINT fk_doctor_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'programada',
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_cita_doctor
        FOREIGN KEY (id_doctor)
        REFERENCES doctor(id_doctor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


ALTER TABLE cita
ADD CONSTRAINT unique_cita_doctor_fecha_hora
UNIQUE (id_doctor, fecha, hora);


INSERT INTO usuario (username, password, estado, id_rol)
VALUES 
('recep1', '123456', 'activo', 2),
('doctor1', '123456', 'activo', 3);


INSERT INTO doctor (nombre, apellido, especialidad, telefono, estado, id_usuario)
VALUES ('Carlos', 'López', 'Medicina General', '55556666', 'activo', 3);


//entregable final

CREATE TABLE historial_clinico (
    id_historial SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    motivo_consulta VARCHAR(150) NOT NULL,
    observaciones TEXT,
    tratamiento TEXT,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,

    CONSTRAINT fk_historial_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente),

    CONSTRAINT fk_historial_doctor
        FOREIGN KEY (id_doctor)
        REFERENCES doctor(id_doctor)
);


CREATE TABLE receta (
    id_receta SERIAL PRIMARY KEY,
    medicamento VARCHAR(150) NOT NULL,
    indicaciones TEXT NOT NULL,
    id_historial INT NOT NULL,

    CONSTRAINT fk_receta_historial
        FOREIGN KEY (id_historial)
        REFERENCES historial_clinico(id_historial)
);

DROP TABLE receta;
select * from usuario


ALTER TABLE historial_clinico
ADD COLUMN proxima_cita DATE;



CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    estado_pago VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    id_cita INT NOT NULL UNIQUE,

    CONSTRAINT fk_pago_cita
        FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

ALTER TABLE pago
DROP COLUMN fecha_pago;