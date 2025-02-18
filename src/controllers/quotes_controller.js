import db from "../database/db.js";
import Quote from "../models/Quote.js";
import axios from "axios";

export const getAllQuotes = async (req, res) => {
  try {
    let quotes = await new Quote().fetchAll();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getQuote = async (req, res) => {
  const { quote_id } = req.params;

  try {
    let quote = await new Quote().fetch({ quote_id });

    if (quote) {
      res.status(200).json({ quote });
    } else {
      throw Error("Quote ID is not found.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const addQuote = async (req, res) => {
  const data = req.body.form_data;

  try {
    if (
      data.billing_account != "Offshore Concept BPO Services, Inc." &&
      data.billing_account != "Viascari, Inc."
    ) {
      return res.status(400).json("Please select a valid company.");
    }

    // let quote_name = `${data.service_type} ${moment().format(
    //   "MMDDYYYYhhmmssA"
    // )}`;

    let quote_name = `${data.service_type}`;

    const timestamp = new Quote().getQuoteStatus({
      status: req.body.timestamp.status,
      remarks: req.body.timestamp.remarks,
      user_id: req.current_user.user_id,
    });

    const { status, ...filteredData } = data;

    const toInsert = {
      quote_name,
      quote_number: await getQuoteNumber(data.billing_account),
      form_data: filteredData,
    };

    const quote = await new Quote(toInsert).add(timestamp);

    return res.status(200).json({ quote });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const updateQuote = async (req, res) => {
  const { quote_id } = req.params;
  try {
    const quote = await new Quote().fetch({ quote_id });

    if (quote) {
      const timestamp = new Quote().getQuoteStatus({
        ...req.body.timestamp,
        user_id: req.current_user.user_id,
      });
      const updated = await new Quote({ ...quote, ...req.body.quote }).update(
        timestamp
      );
      return res.status(200).json({ success: true, updated });
    } else {
      throw Error("Quote ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const deleteQuote = async (req, res) => {
  const { quote_id } = req.params;

  try {
    const quote = await new Quote().fetch({ quote_id });
    if (quote) {
      await new Quote().delete({ quote_id });
      return res
        .status(200)
        .json({ success: true, message: "Record deleted successfully." });
    } else {
      throw Error("Quote ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const generateQuote = async (req, res) => {
  if (!req.query.quote_id) {
    res.sendStatus(400);
    return;
  }

  const url =
    "https://script.google.com/a/macros/viascari.com/s/AKfycbzPp-Mdohq9MIz9N8n8vcXj_08vFzRDKWIoFuQMre-xWECrZsUdA1gDbTyPQetr2DzhcQ/exec";

  try {
    let response = await axios.get(url, {
      params: {
        quote_id: req.query.quote_id,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getQuoteNumber = async (company = "Viascari, Inc.") => {
  let text = "VIA";
  let quote_number = "VIA-43606";

  const quotes = await db("quotes").select("*");

  if (company == "Offshore Concept BPO Services, Inc.") {
    text = "VGC";
    quote_number = "VGC-00000";

    if (quotes.length > 0) {
      let VGCQuotes = quotes.filter(
        (quote) =>
          quote.form_data.billing_account ==
          "Offshore Concept BPO Services, Inc."
      );

      if (VGCQuotes.length > 0) {
        VGCQuotes.sort((a, b) => {
          return b.quote_number.localeCompare(a.quote_number);
        });

        quote_number = VGCQuotes[0].quote_number;
      }
    }
  } else {
    if (quotes.length > 0) {
      let VIAQuotes = quotes.filter(
        (quote) => quote.form_data.billing_account == "Viascari, Inc."
      );

      if (VIAQuotes.length > 0) {
        VIAQuotes.sort((a, b) => {
          return b.quote_number.localeCompare(a.quote_number);
        });

        quote_number = VIAQuotes[0].quote_number;
      }
    }
  }

  let number = Number(quote_number.split("-")[1]) + 1;

  let formatNumber = number.toLocaleString("en-US", {
    minimumIntegerDigits: 5,
    useGrouping: false,
  });

  return `${text}-${formatNumber}`;
};
