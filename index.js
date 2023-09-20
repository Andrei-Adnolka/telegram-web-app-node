const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "6400809882:AAGeT5RidNPrFwGd_CYYu_XDvEEY3cEWO74";

const bot = new TelegramBot(token, { polling: true });
const webApp = "https://spontaneous-pothos-fa716e.netlify.app/";
const app = express();

app.use(express.json());
app.use(cors);

bot.on("message", async (msg) => {
  console.log("msg", msg);
  const { text, chat } = msg;
  const chatId = chat.id;
  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Кнопки для записи и просмотра моих записей",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Записаться", web_app: { url: `${webApp}registration` } }],
            [{ text: "Мои Записи", web_app: { url: `${webApp}my_orders` } }],
          ],
        },
      }
    );
  }
  console.log("msg?.web_app_data", msg?.web_app_data);
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log("data", data);
      await bot.sendMessage(chatId, "спасибо. вы записаны на ....");
    } catch (e) {
      console.log("e", e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  try {
    const { queryId, ...rest } = req.body;
    console.log("data", rest);

    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешное бронирование",
      input_message_content: { message_text: "Будем вас ждать" },
    });
    res.status(200).json({});
  } catch (e) {
    console.log("ERROR => POST", e);
    res.status(500).json({});
  }
});

const PORT = "8000";

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`);
});
