import WebpackDevMiddleware from 'webpack-dev-middleware'
import applyExpressMiddleware from '../lib/apply-express-middleware'
import _debug from 'debug'

const debug = _debug('app:server:webpack-dev')

export default function (compiler, config, publicPath) {
  debug('Enable webpack dev middleware.')
  const paths = config.utils_paths

  const middleware = WebpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.client(),
    hot: true,
    quiet: config.compiler_quiet,
    noInfo: config.compiler_quiet,
    lazy: false,
    stats: config.compiler_stats
  })

  return async function koaWebpackDevMiddleware (ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, {
      end: (content) => (ctx.body = content),
      setHeader: function () {
        ctx.set.apply(ctx, arguments)
      }
    })

    if (hasNext) {
      await next()
    }
  }
}
