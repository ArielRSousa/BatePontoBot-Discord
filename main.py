import discord
import asyncio
import pytz
from datetime import datetime
from config import TOKEN, permitted_role_id


br_tz = pytz.timezone('America/Sao_Paulo')
2
client = discord.Client(intents=discord.Intents.all())

last_message_date_entry = {}
last_message_date_out = {}


@client.event
async def on_ready():
  print(f"===============================")
  print(f'Bot iniciado com sucesso! \nNome: {client.user.name} \nID: {client.user.id} \nVersão: 1.0.0')
  print(f"===============================")
  activity = discord.Activity(name='!entrar', type=discord.ActivityType.watching)
  activity4 = discord.Activity(name='tester', type=discord.ActivityType.streaming)
  await client.change_presence(activity=activity)


@client.event
async def on_message(message):
    user = message.author
    today = datetime.now(br_tz).date()
    
    if message.content.startswith('!entrar' or '!entrada'):
        if any(role.id == permitted_role_id for role in user.roles):
            if user.id in last_message_date_entry:
                if last_message_date_entry[user.id] == today:
                    embed = discord.Embed(title="Entrada", description=f"{user.mention}, você já enviou uma mensagem hoje.", color=discord.Color.gold())
                    bot_msg = await message.channel.send(embed=embed)
                    await asyncio.sleep(3), await bot_msg.delete(), await message.delete()
                    return
            last_message_date_entry[user.id] = today

            time = datetime.now(br_tz).strftime("%H:%M:%S em %d/%m/%y")
            if not message.channel.permissions_for(message.author).send_messages:
                print("Usuário não tem permissão para enviar mensagens no canal.")
                return

            embed = discord.Embed(title="Entrada", description=f"{user.mention} marcou a entrada às {time}", color=discord.Color.blue())

            try: 
                await message.channel.send(embed=embed)
                await message.delete()
            except discord.Forbidden:
                print("Não tenho permissão para enviar mensagens neste canal.")
            except discord.HTTPException as e:
                print(f'Erro ao enviar mensagem: {e}')
        else:
            embed = discord.Embed(title="Entrada", description=f"{user.mention}, você não tem permissão para usar este comando.", color=discord.Color.red())
            bot_msg = await message.channel.send(embed=embed)
            await asyncio.sleep(3), await bot_msg.delete(), await message.delete()
            return

    if message.content.startswith('!sair'):
        if any(role.id == permitted_role_id for role in user.roles):
            if user.id in last_message_date_out:
                if last_message_date_out[user.id] == today:
                    embed = discord.Embed(title="Saída", description=f"{user.mention}, você já enviou uma mensagem hoje.", color=discord.Color.gold())
                    bot_msg = await message.channel.send(embed=embed)
                    await asyncio.sleep(3), await bot_msg.delete(), await message.delete()
                    return
            last_message_date_out[user.id] = today 

            time = datetime.now(br_tz).strftime("%H:%M:%S em %d/%m/%y")
            if not message.channel.permissions_for(message.author).send_messages:
                print("Usuário não tem permissão para enviar mensagens no canal.")
                return
        else:
            embed = discord.Embed(title="Saída", description=f"{user.mention}, você não tem permissão para usar este comando.", color=discord.Color.red())
            bot_msg = await message.channel.send(embed=embed)
            await asyncio.sleep(3), await bot_msg.delete(), await message.delete()
            return

        embed = discord.Embed(title="Saída", description=f"{user.mention} marcou a saída às {time}", color=discord.Color.red())
        
        try:
            await message.channel.send(embed=embed)
            await message.delete()
        except discord.Forbidden:
            print("Não tenho permissão para enviar mensagens neste canal.")
        except discord.HTTPException as e:
            print(f'Erro ao enviar mensagem: {e}')

client.run(TOKEN)
