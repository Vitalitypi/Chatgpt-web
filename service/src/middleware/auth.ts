import { isNotEmptyString } from '../utils/is'
import Redis from 'ioredis'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const redis = new Redis()
  console.log("AUTH_SECRET_KEY",AUTH_SECRET_KEY)
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
      if (!Authorization)
        throw new Error('Error: 无访问权限 | No access rights')
      const token = Authorization.replace('Bearer ', '').trim()
      // 检索数据
      const value = await redis.get(token);
      if (value == null)
        throw new Error('Error: 填写密钥即可访问！')
      if (value == null || value == '0')
        throw new Error('Error: 不能取消关注公众号！')
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }  finally {
      // 关闭Redis连接
      await redis.quit();
    }
  }
  else {
    next()
  }
}

export { auth }
