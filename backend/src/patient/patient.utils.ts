import { Op } from "sequelize";
import { Patient } from "./entities/patient.entity";

/**
 * Генерирует следующий код пациента в формате P-YYYY-NNNNNN
 * Пример: P-2026-000123
 */
export async function generatePatientCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `P-${year}-`;

  // Находим последний код за текущий год
  const last = await Patient.findOne({
    where: { code: { [Op.like]: `${prefix}%` } },
    order: [["code", "DESC"]],
    attributes: ["code"],
  });

  let next = 1;
  if (last) {
    const seq = parseInt(last.code.slice(prefix.length), 10);
    if (!Number.isNaN(seq)) next = seq + 1;
  }

  return `${prefix}${String(next).padStart(6, "0")}`;
}
