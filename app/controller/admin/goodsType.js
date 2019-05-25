'use strict';

const BaseController = require('./base.js');

class GoodsTypeController extends BaseController {
  async index() {
    const goodsType = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsType/index', {
      goodsType,
    });
  }

  async add() {
    await this.ctx.render('admin/goodsType/add');
  }

  async doAdd() {
    const goodsTypeInfo = this.ctx.request.body;
    const goodsType = new this.ctx.model.GoodsType(goodsTypeInfo);
    await goodsType.save();
    await this.success('/admin/goodsType', '增加商品类型成功');
  }

  async edit() {
    const _id = this.ctx.query._id;
    const goodsTypeInfo = await this.ctx.model.GoodsType.findOne({
      _id,
    });
    await this.ctx.render('admin/goodsType/edit', {
      goodsTypeInfo,
    });
  }

  async doEdit() {
    const goodsTypeInfo = this.ctx.request.body;
    const _id = this.ctx.query._id;
    const title = this.ctx.request.body.title;
    const description = this.ctx.request.body.description;
    await this.ctx.model.GoodsType.updateOne({
      _id,
    }, {
      title,
      description,
    });
    await this.success('/admin/goodsType', '编辑商品类型成功');
  }
}

module.exports = GoodsTypeController;
