import { test, expect } from '@playwright/test';

test.describe('página inicial', () => {
  test('carrega com título, landmark principal e sem erro de console', async ({ page }) => {
    const errosConsole = [];
    page.on('pageerror', (erro) => errosConsole.push(erro.message));

    await page.goto('/');

    await expect(page).toHaveTitle(/Douglas Fernandes/);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('#capa')).toBeVisible();
    await expect(page.locator('#ano')).toHaveText(String(new Date().getFullYear()));

    expect(errosConsole).toEqual([]);
  });

  test('menu mobile alterna aria-expanded ao clicar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const botaoMenu = page.locator('#botaoMenu');
    await expect(botaoMenu).toHaveAttribute('aria-expanded', 'false');

    await botaoMenu.click();
    await expect(botaoMenu).toHaveAttribute('aria-expanded', 'true');
  });

  test('formulário de contato monta a URL do WhatsApp com os dados preenchidos', async ({ page }) => {
    await page.goto('/');

    await page.fill('#nomeContato', 'Visitante Teste');
    await page.fill('#mensagemContato', 'Mensagem de teste automatizado.');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('#formularioWhatsapp button[type="submit"]'),
    ]);

    await popup.waitForLoadState('domcontentloaded').catch(() => {});
    // wa.me redireciona para api.whatsapp.com/send em navegação real de navegador
    expect(popup.url()).toMatch(/whatsapp\.com/);
    expect(popup.url()).toContain('5522998984135');
    const texto = new URL(popup.url()).searchParams.get('text');
    expect(texto).toContain('Visitante Teste');
  });
});
