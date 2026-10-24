import { Request, Response } from 'express';
import { StoreSettings } from '../models/StoreSettings';

// GET /api/settings (Public storefront settings)
export const getPublicSettings = async (_req: Request, res: Response) => {
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = await StoreSettings.create({});
  }

  // Filter out inactive banners for public view
  const activeBanners = (settings.banners || [])
    .filter((b) => b.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  res.status(200).json({
    success: true,
    data: {
      storeName: settings.storeName,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      brandDescription: settings.brandDescription,
      storePhone: settings.storePhone,
      storeEmail: settings.storeEmail,
      storeAddress: settings.storeAddress,
      supportHours: settings.supportHours,
      copyrightText: settings.copyrightText,
      deliveryDhaka: settings.deliveryDhaka,
      deliveryOutsideDhaka: settings.deliveryOutsideDhaka,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      isCodEnabled: settings.isCodEnabled,
      isOnlinePaymentEnabled: settings.isOnlinePaymentEnabled,
      socialLinks: settings.socialLinks,
      banners: activeBanners,
      seo: settings.seo,
    },
  });
};
