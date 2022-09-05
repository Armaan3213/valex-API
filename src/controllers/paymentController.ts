/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { OnlinePaymentData } from "../interfaces/paymentInterfaces";
import { BusinessRepository } from "../repositories/businessRepository";
import { CardRepository } from "../repositories/cardRepository";
import { PaymentRepository } from "../repositories/paymentRepository";
import { RechargeRepository } from "../repositories/rechargeRepository";
import { CardValidator } from "../services/cardServices/cardsServicesValidators";
import { OnlinePaymentService } from "../services/paymentServices/onlinePaymentService";
import { POSPaymentService } from "../services/paymentServices/posPaymentService";
import { CardUtils } from "../utils/cardUtils";
import { CryptDataUtils } from "../utils/cryptDataUtils";

export async function buyFromBusinessPOS(
  req: Request<
    {},
    {},
    { cardId: number; password: string; businessId: number; amount: number }
  >,
  res: Response
) {
  const { cardId, password, businessId, amount } = req.body;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();
  const businessRepository = new BusinessRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const posPaymentService = new POSPaymentService(
    cardValidator,
    cryptDataUtils,
    cardUtils,
    cardRepository,
    businessRepository,
    rechargeRepository,
    paymentRepository
  );

  await posPaymentService.execute(cardId, password, businessId, amount);

  return res.sendStatus(200);
}

export async function buyFromBusinessOnline(
  req: Request<{}, {}, OnlinePaymentData>,
  res: Response
) {
  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();
  const businessRepository = new BusinessRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const onlinePaymentService = new OnlinePaymentService(
    cardValidator,
    cryptDataUtils,
    cardUtils,
    cardRepository,
    businessRepository,
    rechargeRepository,
    paymentRepository
  );

  await onlinePaymentService.execute(req.body);

  return res.sendStatus(200);
}
