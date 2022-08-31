import { Request, Response } from "express";
import * as CardsServices from "../services/cardsServices";
import { TransactionTypes } from "../types/cardTypes";

export async function createCard(
  req: Request<{ employeeId: string; cardType: TransactionTypes }>,
  res: Response
) {
  const { employeeId, cardType } = req.params;
  const { API_KEY } = res.locals;

  await CardsServices.createNewCard(
    API_KEY,
    parseInt(employeeId, 10),
    cardType
  );

  return res.sendStatus(201);
}

export async function activateCard(
  req: Request<{ cardId: string }, {}, { password: string; CVC: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password, CVC } = req.body;

  await CardsServices.activateCard(parseInt(cardId, 10), password, CVC);

  return res.sendStatus(200);
}
