const axios = require('axios');

const elmaApi = axios.create({
  baseURL: 'https://v6nty3pmxnwgo.elma365.ru/pub/v1',

  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ELMA_API_TOKEN}`
  }
});

const createContact = async (data) => {
  try {
    const response = await elmaApi.post('/app/_clients/_contacts/create', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании контакта:', error);
    throw error;
  }
};

const createCompany = async (data) => {
  try {
    const response = await elmaApi.post('/app/_clients/_companies/create', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании компании:', error);
    throw error;
  }
};

const createWarranty = async (data) => {
  try {
    const payload = {
      context: {
        "__directory": data.__directory,
        "__subscribers": data.__subscribers,
        "__externalProcessMeta": data.__externalProcessMeta,
        "__externalId": data.__externalId,
        "contactFirstName": data.contactFirstName,
        "contactLastName": data.contactLastName,
        "contactPatronymic": data.contactPatronymic,
        "contactPhone": data.contactPhone,
        "contactEmail": data.contactEmail,
        "companyName": data.companyName,
        "companyINN": data.companyINN,
        "kpp": data.kpp,
        "warrantyFile": [], // Пустой массив, как указано в документации
        "warranty_file_inRow": data.warranty_file_inRow, // Base64 строка файла
        "vkhodyashii_nomer": data.vkhodyashii_nomer,
        "fileName": data.fileName // Имя файла
      },
      "statusGroupId": data.statusGroupId,
      "withEventForceCreate": true
    };

    const response = await elmaApi.post('/app/soglasovanie_dostupa/registraciya_i_soglasovanie/create', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Ошибка при создании гарантийного письма:', error.response.data);
    } else {
      console.error('Ошибка при создании гарантийного письма:', error.message);
    }
    throw error;
  }
};



module.exports = {
  createContact,
  createCompany,
  createWarranty
};



