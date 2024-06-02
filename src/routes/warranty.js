const express = require('express');
const router = express.Router();
const { createWarranty } = require('../utils/elmaApi');

router.post('/', async (req, res) => {
  try {
      console.log('Полученные данные для создания гарантийного письма:', req.body); // Логирование данных

      const {
          contactFirstName,
          contactLastName,
          contactPatronymic,
          contactPhone,
          contactEmail,
          companyName,
          companyINN,
          kpp,
          warranty_file_inRow,
          fileName
      } = req.body;

      const data = {
          contactFirstName: contactFirstName || "exampleFirstName",
          contactLastName: contactLastName || "exampleLastName",
          contactPatronymic: contactPatronymic || "examplePatronymic",
          contactPhone: contactPhone || "examplePhone",
          contactEmail: contactEmail || "exampleEmail",
          companyName: companyName || "exampleCompanyName",
          companyINN: companyINN || "exampleINN",
          kpp: kpp || "exampleKPP",
          warranty_file_inRow: warranty_file_inRow, // Base64 строка файла
          fileName: fileName, // Имя файла
          __directory: "00000000-0000-0000-0000-000000000000",
          __subscribers: ["00000000-0000-0000-0000-000000000000"],
          __externalProcessMeta: "undefined",
          __externalId: "example",
          vkhodyashii_nomer: "example",
          statusGroupId: "a35cd8de-0c73-4f6a-8218-90193d02e2e0"
      };

      console.log('Данные для создания гарантийного письма:', data); // Логирование данных

      const result = await createWarranty(data);

      res.status(200).json({ message: 'Документ успешно загружен', details: result });
  } catch (error) {
      console.error('Ошибка при загрузке документа:', error); // Логирование ошибок
      res.status(500).json({ message: 'Ошибка при загрузке документа', details: error.message });
  }
});

module.exports = router;
