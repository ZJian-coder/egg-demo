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

  async auth() {
    const accessList = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    const role_id = this.ctx.request.query._id;
    const authInfo = await this.ctx.model.RoleAccess.find({ role_id });
    const access_id_arry = [];
    authInfo.forEach(function(item) {
      access_id_arry.push(item.access_id.toString());
    });
    accessList.forEach(function(item) {
      if (access_id_arry.indexOf(item._id.toString()) >= 0) {
        item.checked = 'true';
      }
      item.items.forEach(function(initem) {
        if (access_id_arry.indexOf(initem._id.toString()) >= 0) {
          initem.checked = 'true';
        }
      });
    });
    await this.ctx.render('/admin/role/auth', {
      accessList,
      role_id,
    });
  }

  async doAuth() {
    const authInfo = this.ctx.request.body;
    const role_id = authInfo.role_id;
    await this.ctx.model.RoleAccess.deleteMany({ role_id });
    const access_node = authInfo.access_node;
    for (let i = 0; i < access_node.length; i++) {
      const role_access = new this.ctx.model.RoleAccess({
        role_id,
        access_id: access_node[i],
      });
      await role_access.save();
    }
    await this.success('/admin/role/auth?_id=' + role_id, '授权成功');
  }
}

module.exports = RoleController;
