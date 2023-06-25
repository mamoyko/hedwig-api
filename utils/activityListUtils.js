const db = require("../models");
const logger = require("../lib/loggers");
const { get } = require("lodash");

const logs = (level, message) => {
  logger.log(level, message);
};

const getActivityListSql = (params) => {
  const { isCount = false, user_id } = params;
  let selectFields = `
    sb.id as blast_id,
    sm.id as sender_masks_id,
    sm.name as sender_mask_name,
    sb.name as blast_name,
    sb.recipient_type as recipient_type,
    sb.status as status,
    u.firstname as firstname,
    u.lastname as lastname,
    sb.createdAt as createdAt
    `;

  let join = `
    INNER JOIN 
      SenderMasks sm ON sm.id = sb.sender_masks_id
    INNER JOIN 
      Users u ON sb.user_id = u.id 
  `;

  let userIdFilter = "";
  if (user_id) {
    userIdFilter = `${getUserFilter({ user_id })}`;
  }

  let where = ` 1=1 ${userIdFilter}`;

  if (isCount) {
    selectFields = "COUNT(*) as total_count";
  }

  return `SELECT ${selectFields} from SmsBlasts as sb ${join} WHERE ${where}`;
};

const getUserFilter = ({ user_id }) => {
  let userIdSQL = "";
  if (user_id) {
    userIdSQL = `AND sb.user_id = '${user_id}'`;
  }
  return userIdSQL;
};

const getActivityListWithPagination = (params) => {
  const { limit, page } = params;
  const offset = (page - 1) * limit;
  const baseSQL = getActivityListSql(params);
  return `${baseSQL} ORDER BY sb.createdAt DESC LIMIT ${limit} OFFSET ${offset}`;
};

const getActivityList = async (params) => {
  try {
    const countSQL = getActivityListSql({ ...params, isCount: true });
    const count = await db.sequelize.query(countSQL);
    const sql = getActivityListWithPagination(params);
    const data = await db.sequelize.query(sql);
    return {
      list: data[0],
      total_count: parseInt(get(count, "[0][0].total_count", 0)),
    };
  } catch (error) {
    logs(
      "error",
      `Sequelize error on getting activity list SQL: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

module.exports = {
  getActivityList,
};
