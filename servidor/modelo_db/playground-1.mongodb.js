use('innovation')

// Crear colección con validación estricta (todos los campos requeridos)
db.createCollection('iniciativas', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            title: 'Validación del Esquema de Iniciativas',
            required: [
                '_id',
                'titulo',
                'tipo',
                'resumen',
                'descripcion',
                'problema',
                'beneficiados',
                'categoria',
                'competencias',
                'cantidadIntegrantes',
                'visibilidad',
                'etiquetas',
                'estado',
                'propietario',
                'miembros',
                'fechaCreacion',
                'fechaUltimaModificacion'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId',
                    description: 'El _id es obligatorio y debe ser de tipo ObjectId'
                },
                titulo: {
                    bsonType: 'string',
                    description: 'El título es obligatorio y debe ser un texto'
                },
                tipo: {
                    enum: ['Reto', 'Idea', 'Necesidad'],
                    description: 'Valores aceptados: Reto, Idea, Necesidad'
                },
                resumen: {
                    bsonType: 'string',
                    description: 'El resumen es obligatorio y debe ser un texto'
                },
                descripcion: {
                    bsonType: 'string',
                    description: 'La descripción es obligatoria y debe ser un texto'
                },
                problema: {
                    bsonType: 'string',
                    description: 'El problema es obligatorio y debe ser un texto'
                },
                beneficiados: {
                    bsonType: 'string',
                    description: 'Los beneficiados son obligatorios y debe ser un texto'
                },
                categoria: {
                    enum: [
                        'Tecnología',
                        'Educación',
                        'Sostenibilidad',
                        'Impacto Social',
                        'Negocios y Emprendimiento',
                        'Salud y Bienestar',
                        'Cultura y Creatividad',
                        'Otros'
                    ],
                    description: 'La categoría es obligatoria y debe ser uno de los valores definidos'
                },
                competencias: {
                    bsonType: 'array',
                    description: 'Debe ser un arreglo de ObjectIds de competencias',
                    items: {
                        bsonType: 'objectId'
                    }
                },
                cantidadIntegrantes: {
                    bsonType: 'int',
                    minimum: 1,
                    description: 'La cantidad de integrantes es obligatoria y debe ser un entero mayor o igual a 1'
                },
                visibilidad: {
                    enum: ['Pública', 'Institucional', 'Restringida', 'Privada'],
                    description: 'La visibilidad es obligatoria y debe ser un enum válido'
                },
                etiquetas: {
                    bsonType: 'array',
                    description: 'Debe ser un arreglo de cadenas de texto',
                    items: {
                        bsonType: 'string'
                    }
                },
                estado: {
                    enum: [
                        'Borrador',
                        'Publicada',
                        'En formación de equipo',
                        'Convertida en proyecto',
                        'Archivada'
                    ],
                    description: 'El estado es obligatorio y debe ser un enum válido'
                },
                propietario: {
                    bsonType: 'objectId',
                    description: 'El propietario es obligatorio y debe ser un ObjectId de usuario'
                },
                miembros: {
                    bsonType: 'array',
                    description: 'Debe ser un arreglo de ObjectIds de usuarios miembros',
                    items: {
                        bsonType: 'objectId'
                    }
                },
                fechaCreacion: {
                    bsonType: 'date',
                    description: 'La fecha de creación es obligatoria'
                },
                fechaUltimaModificacion: {
                    bsonType: 'date',
                    description: 'La fecha de última modificación es obligatoria'
                }
            }
        }
    }
});
