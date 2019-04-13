'use strict';

const BaseController = require('./base.js');

class RoleController extends BaseController {
  async index() {
    const roleInfo = await this.ctx.model.Role.find({});
    await this.ctx.render('/admin/role/index', {
      roleInfo,
    });
  }

  async add() {
    await this.ctx.render('/admin/role/add');
  }

  async doAdd() {
    const roleInfo = this.ctx.request.body;
    const role = new this.ctx.model.Role({
      title: roleInfo.title,
      description: roleInfo.description,
    });
    await role.save();
    await this.success('/admin/role', '增加角色成功');
  }

  async edit() {
    const id = this.ctx.query._id;
    const roleInfo = await this.ctx.model.Role.find({ _id: id });
    await this.ctx.render('/admin/role/edit', {
      roleInfo: roleInfo[0],
    });
  }

  async doEdit() {
    const roleInfo = this.ctx.request.body;
    const title = roleInfo.title;
    const description = roleInfo.description;
    const _id = roleInfo._id;
    await this.ctx.model.Role.updateOne({ _id }, { title, description });
    await this.success('/admin/role', '编辑角色成功');
  }
}

module.exports = RoleController;
